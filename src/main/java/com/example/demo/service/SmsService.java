package com.example.demo.service;

import com.example.demo.dto.CreateSmsRequest;
import com.example.demo.dto.SmsDto;
import com.example.demo.model.SmsEntity;
import com.example.demo.repository.SmsRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SmsService {

    private final SmsRepository smsRepository;

    public SmsService(SmsRepository smsRepository) {
        this.smsRepository = smsRepository;
    }

    public SmsDto sendSms(CreateSmsRequest request) {
        SmsEntity entity = SmsEntity.builder()
                .id(UUID.randomUUID().toString())
                .senderNumber(request.senderNumber())
                .recipientNumber(request.recipientNumber())
                .content(request.content())
                .timestamp(LocalDateTime.now())
                .build();

        SmsEntity saved = smsRepository.save(entity);
        return mapToDto(saved);
    }

    public List<SmsDto> getMessagesForNumber(String phoneNumber) {
        return smsRepository.findByRecipientNumberOrSenderNumberOrderByTimestampDesc(phoneNumber, phoneNumber)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    private SmsDto mapToDto(SmsEntity entity) {
        return new SmsDto(
                entity.getId(),
                entity.getSenderNumber(),
                entity.getRecipientNumber(),
                entity.getContent(),
                entity.getTimestamp()
        );
    }
}