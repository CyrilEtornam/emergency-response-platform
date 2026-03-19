// RefreshTokenRepository.java
package com.erp.auth_service.repository;
import com.erp.auth_service.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByTokenHash(String tokenHash);
    void deleteAllByUserId(UUID userId);
}