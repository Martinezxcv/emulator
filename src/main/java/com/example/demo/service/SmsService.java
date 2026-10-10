package com.example.demo.service;

import com.example.demo.dto.CreateSmsRequest;
import com.example.demo.dto.SmsDto;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class SmsService {

    private final List<SmsDto> smsStorage = Collections.synchronizedList(new ArrayList<>());

    public SmsDto sendSms(CreateSmsRequest request) {
        SmsDto newSms = new SmsDto(
                UUID.randomUUID().toString(),
                request.senderNumber(),
                request.recipientNumber(),
                request.content(),
                LocalDateTime.now()
        );
        smsStorage.add(newSms);
        return newSms;
    }

    public List<SmsDto> getMessagesForNumber(String phoneNumber) {
        return smsStorage.stream()
                .filter(sms -> sms.recipientNumber().equals(phoneNumber) || sms.senderNumber().equals(phoneNumber))
                .sorted(Comparator.comparing(SmsDto::timestamp).reversed())
                .toList();
    }
}