package com.erp.auth_service.controller;

import com.erp.auth_service.dto.response.ApiResponse;
import com.erp.auth_service.model.AuditLog;
import com.erp.auth_service.model.Role;
import com.erp.auth_service.repository.AuditLogRepository;
import com.erp.auth_service.repository.RoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class RoleController {

    private final RoleRepository roleRepository;
    private final AuditLogRepository auditLogRepository;

    public RoleController(RoleRepository roleRepository, AuditLogRepository auditLogRepository) {
        this.roleRepository = roleRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping("/roles")
    public ResponseEntity<ApiResponse<List<Role>>> getRoles() {
        List<Role> roles = roleRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Roles retrieved", roles));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        List<AuditLog> logs = auditLogRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved", logs));
    }
}
