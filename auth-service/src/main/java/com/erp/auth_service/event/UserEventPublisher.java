package com.erp.auth_service.event;

import com.erp.auth_service.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UserEventPublisher {

    public void publishUserCreated(User user) {
        log.info("User created event: userId={}, email={}, fullName={}, role={}",
                user.getId(), user.getEmail(), user.getFullName(),
                user.getRole() != null ? user.getRole().getName() : null);
    }

    public void publishRoleChanged(User user, String oldRole) {
        log.info("User role changed event: userId={}, email={}, oldRole={}, newRole={}",
                user.getId(), user.getEmail(), oldRole,
                user.getRole() != null ? user.getRole().getName() : null);
    }
}
