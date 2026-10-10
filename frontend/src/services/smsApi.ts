import type {SmsMessage} from '../types/sms';

const API_BASE_URL = 'http://localhost:8080/api/sms';

export async function fetchMessages(phoneNumber: string): Promise<SmsMessage[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/${phoneNumber}`);
        if (!response.ok) throw new Error('Nie udało się pobrać wiadomości');
        return await response.json();
    } catch (error) {
        console.error('Błąd pobierania SMS:', error);
        return [];
    }
}

export async function sendSmsApi(senderNumber: string, recipientNumber: string, content: string): Promise<SmsMessage | null> {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ senderNumber, recipientNumber, content }),
        });

        if (!response.ok) throw new Error('Nie udało się wysłać wiadomości');
        return await response.json();
    } catch (error) {
        console.error('Błąd wysyłania SMS:', error);
        return null;
    }
}