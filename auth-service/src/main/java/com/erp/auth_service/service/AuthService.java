package com.erp.auth_service.service;

import com.erp.auth_service.dto.request.LoginRequest;
import com.erp.auth_service.dto.request.RegisterRequest;
import com.erp.auth_service.dto.request.RefreshRequest;
import com.erp.auth_service.dto.request.VerifyTokenRequest;
import com.erp.auth_service.dto.response.TokenResponse;
import com.erp.auth_service.dto.response.UserResponse;
import com.erp.auth_service.dto.response.VerifyResponse;
import com.erp.auth_service.event.UserEventPublisher;
import com.erp.auth_service.exception.ResourceNotFoundException;
import com.erp.auth_service.model.RefreshToken;
import com.erp.auth_service.model.Role;
import com.erp.auth_service.model.User;
import com.erp.auth_service.repository.RefreshTokenRepository;
import com.erp.auth_service.repository.RoleRepository;
import com.erp.auth_service.repository.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserEventPublisher eventPublisher;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder,
                       UserEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + request.getRoleName()));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(role)
                .isActive(true)
                .build();

        user = userRepository.save(user);
        log.info("Registered new user: id={} email={}", user.getId(), user.getEmail());

        eventPublisher.publishUserCreated(user);

        return UserResponse.from(user);
    }

    @Transactional
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new BadCredentialsException("Account is disabled");
        }

        String accessToken = jwtService.generateAccessToken(user);
        String rawRefreshToken = jwtService.generateRefreshToken();
        String tokenHash = jwtService.hashToken(rawRefreshToken);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(tokenHash)
                .expiresAt(LocalDateTime.now().plusNanos(jwtService.getRefreshTokenExpiryMs() * 1_000_000))
                .isRevoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);
        log.info("User logged in: id={}", user.getId());

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(rawRefreshToken)
                .expiresIn(jwtService.getAccessTokenExpiryMs() / 1000)
                .build();
    }

    @Transactional
    public void logout(String rawRefreshToken, String accessToken) {
        String tokenHash = jwtService.hashToken(rawRefreshToken);
        refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
            log.info("Revoked refresh token for userId={}", rt.getUser().getId());
        });

        if (accessToken != null && !accessToken.isBlank()) {
            jwtService.blacklistToken(accessToken);
        }
    }

    @Transactional
    public TokenResponse refresh(RefreshRequest request) {
        String rawRefreshToken = request.getRefreshToken();
        String tokenHash = jwtService.hashToken(rawRefreshToken);

        RefreshToken existing = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (existing.isRevoked()) {
            throw new IllegalArgumentException("Refresh token has been revoked");
        }
        if (existing.isExpired()) {
            throw new IllegalArgumentException("Refresh token has expired");
        }

        // Rotate: revoke old, issue new
        existing.setRevoked(true);
        refreshTokenRepository.save(existing);

        User user = existing.getUser();
        String newAccessToken = jwtService.generateAccessToken(user);
        String newRaw = jwtService.generateRefreshToken();
        String newHash = jwtService.hashToken(newRaw);

        RefreshToken newToken = RefreshToken.builder()
                .user(user)
                .tokenHash(newHash)
                .expiresAt(LocalDateTime.now().plusNanos(jwtService.getRefreshTokenExpiryMs() * 1_000_000))
                .isRevoked(false)
                .build();

        refreshTokenRepository.save(newToken);
        log.info("Rotated refresh token for userId={}", user.getId());

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRaw)
                .expiresIn(jwtService.getAccessTokenExpiryMs() / 1000)
                .build();
    }

    public VerifyResponse verify(VerifyTokenRequest request) {
        String token = request.getToken();

        if (!jwtService.validateToken(token)) {
            return VerifyResponse.builder().valid(false).build();
        }

        try {
            Claims claims = jwtService.extractClaims(token);
            return VerifyResponse.builder()
                    .valid(true)
                    .userId(UUID.fromString(claims.get("userId", String.class)))
                    .email(claims.getSubject())
                    .role(claims.get("role", String.class))
                    .build();
        } catch (Exception e) {
            log.debug("Failed to extract claims from token: {}", e.getMessage());
            return VerifyResponse.builder().valid(false).build();
        }
    }
}
