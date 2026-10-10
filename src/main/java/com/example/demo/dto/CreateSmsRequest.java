package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateSmsRequest(
        @NotBlank String senderNumber,
        @NotBlank String recipientNumber,
        @NotBlank String content
) {}
