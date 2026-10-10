package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmsEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String senderNumber;

    @Column(nullable = false)
    private String recipientNumber;

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}