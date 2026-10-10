package com.example.demo.dto;

import java.time.LocalDateTime;

public record SmsDto(
        String id,
        String senderNumber,
        String recipientNumber,
        String content,
        LocalDateTime timestamp
) {}
