package com.example.demo.repository;

import com.example.demo.model.SmsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SmsRepository extends JpaRepository<SmsEntity, String> {
    List<SmsEntity> findByRecipientNumberOrSenderNumberOrderByTimestampDesc(String recipientNumber, String senderNumber);
}