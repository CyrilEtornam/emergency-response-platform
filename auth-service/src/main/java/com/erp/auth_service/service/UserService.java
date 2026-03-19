package com.erp.auth_service.service;

import com.erp.auth_service.dto.response.UserResponse;
import com.erp.auth_service.event.UserEventPublisher;
import com.erp.auth_service.exception.ResourceNotFoundException;
import com.erp.auth_service.model.Role;
import com.erp.auth_service.model.User;
import com.erp.auth_service.repository.RoleRepository;
import com.erp.auth_service.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserEventPublisher eventPublisher;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       UserEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.eventPublisher = eventPublisher;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::from)
                .toList();
    }

    public UserResponse getUserById(UUID id) {
        User user = findUserOrThrow(id);
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse updateRole(UUID id, String roleName) {
        User user = findUserOrThrow(id);
        String oldRole = user.getRole() != null ? user.getRole().getName() : null;

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleName));

        user.setRole(role);
        user = userRepository.save(user);
        log.info("Updated role for userId={} from {} to {}", id, oldRole, roleName);

        eventPublisher.publishRoleChanged(user, oldRole);

        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse updateStatus(UUID id, boolean active) {
        User user = findUserOrThrow(id);
        user.setActive(active);
        user = userRepository.save(user);
        log.info("Updated status for userId={} to active={}", id, active);
        return UserResponse.from(user);
    }

    @Transactional
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found: " + id);
        }
        userRepository.deleteById(id);
        log.info("Deleted userId={}", id);
    }

    private User findUserOrThrow(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }
}
