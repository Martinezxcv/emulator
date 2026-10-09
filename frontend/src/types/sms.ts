export interface SmsMessage {
    id: string;
    senderNumber: string;
    recipientNumber: string;
    content: string;
    timestamp: string;
}

export type PhoneScreen = 'HOME' | 'INBOX' | 'COMPOSE' | 'VIEW_SMS';

export interface CreateSmsPayload {
    recipientNumber: string;
    content: string;
}