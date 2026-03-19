package com.erp.auth_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class VerifyTokenRequest {

    @NotBlank(message = "Token is required")
    private String token;
}
