package com.erp.auth_service.controller;

import com.erp.auth_service.dto.request.LoginRequest;
import com.erp.auth_service.dto.request.RefreshRequest;
import com.erp.auth_service.dto.request.RegisterRequest;
import com.erp.auth_service.dto.request.VerifyTokenRequest;
import com.erp.auth_service.dto.response.ApiResponse;
import com.erp.auth_service.dto.response.TokenResponse;
import com.erp.auth_service.dto.response.UserResponse;
import com.erp.auth_service.dto.response.VerifyResponse;
import com.erp.auth_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenResponse>> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse tokens = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", tokens));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestParam String refreshToken,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String accessToken = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            accessToken = authHeader.substring(7);
        }
        authService.logout(refreshToken, accessToken);
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenResponse>> refresh(@Valid @RequestBody RefreshRequest request) {
        TokenResponse tokens = authService.refresh(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", tokens));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<VerifyResponse>> verify(@Valid @RequestBody VerifyTokenRequest request) {
        VerifyResponse result = authService.verify(request);
        return ResponseEntity.ok(ApiResponse.success("Token verified", result));
    }
}
