package com.example.demo.controller;

import com.example.demo.dto.CreateSmsRequest;
import com.example.demo.dto.SmsDto;
import com.example.demo.service.SmsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sms")
@CrossOrigin(origins = "*")
public class SmsController {

    private final SmsService smsService;

    public SmsController(SmsService smsService) {
        this.smsService = smsService;
    }

    @PostMapping
    public ResponseEntity<SmsDto> sendSms(@Valid @RequestBody CreateSmsRequest request) {
        SmsDto createdSms = smsService.sendSms(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSms);
    }

    @GetMapping("/{phoneNumber}")
    public ResponseEntity<List<SmsDto>> getMessages(@PathVariable String phoneNumber) {
        List<SmsDto> messages = smsService.getMessagesForNumber(phoneNumber);
        return ResponseEntity.ok(messages);
    }
}