// RoleRepository.java
package com.erp.auth_service.repository;
import com.erp.auth_service.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(String name);
}