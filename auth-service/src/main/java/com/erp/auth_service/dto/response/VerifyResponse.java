package com.erp.auth_service.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class VerifyResponse {

    private boolean valid;
    private UUID userId;
    private String email;
    private String role;
}
