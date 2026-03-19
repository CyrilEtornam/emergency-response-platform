package com.erp.auth_service.event;

import com.erp.auth_service.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class UserEventPublisher {

    private final RabbitTemplate rabbitTemplate;
    private final String exchange;
    private final String userCreatedKey;
    private final String roleChangedKey;

    public UserEventPublisher(RabbitTemplate rabbitTemplate,
                              @Value("${rabbitmq.exchange}") String exchange,
                              @Value("${rabbitmq.routing-keys.user-created}") String userCreatedKey,
                              @Value("${rabbitmq.routing-keys.role-changed}") String roleChangedKey) {
        this.rabbitTemplate = rabbitTemplate;
        this.exchange = exchange;
        this.userCreatedKey = userCreatedKey;
        this.roleChangedKey = roleChangedKey;
    }

    public void publishUserCreated(User user) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", user.getId().toString());
        payload.put("email", user.getEmail());
        payload.put("fullName", user.getFullName());
        payload.put("role", user.getRole() != null ? user.getRole().getName() : null);

        Map<String, Object> event = buildEnvelope("user.created", payload);
        send(userCreatedKey, event);
        log.info("Published user.created event for userId={}", user.getId());
    }

    public void publishRoleChanged(User user, String oldRole) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", user.getId().toString());
        payload.put("email", user.getEmail());
        payload.put("oldRole", oldRole);
        payload.put("newRole", user.getRole() != null ? user.getRole().getName() : null);

        Map<String, Object> event = buildEnvelope("user.role_changed", payload);
        send(roleChangedKey, event);
        log.info("Published user.role_changed event for userId={}", user.getId());
    }

    private Map<String, Object> buildEnvelope(String eventType, Map<String, Object> payload) {
        Map<String, Object> envelope = new HashMap<>();
        envelope.put("eventType", eventType);
        envelope.put("timestamp", Instant.now().toString());
        envelope.put("payload", payload);
        return envelope;
    }

    private void send(String routingKey, Map<String, Object> event) {
        try {
            rabbitTemplate.convertAndSend(exchange, routingKey, event);
        } catch (Exception e) {
            log.error("Failed to publish event to exchange={} routingKey={}: {}", exchange, routingKey, e.getMessage());
        }
    }
}
