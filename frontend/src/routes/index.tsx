import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import type {PhoneScreen, SmsMessage} from '../types/sms';
import {
    KEY_LAYOUT,
    INITIAL_MULTI_TAP_STATE,
    type MultiTapState,
    processKeyPress,
} from '../utils/multiTap';

export const Route = createFileRoute('/')({
    component: NokiaPhone,
});

export function NokiaPhone() {
    const [screen, setScreen] = useState<PhoneScreen>('HOME');
    const [recipient, setRecipient] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [activeInput, setActiveInput] = useState<'RECIPIENT' | 'CONTENT'>('RECIPIENT');
    const [multiTapState, setMultiTapState] = useState<MultiTapState>(INITIAL_MULTI_TAP_STATE);
    const [selectedSms, setSelectedSms] = useState<SmsMessage | null>(null);

    const [messages, setMessages] = useState<SmsMessage[]>([
        {
            id: '1',
            senderNumber: '600111222',
            recipientNumber: 'JA',
            content: 'Siema! Dziala ten emulator?',
            timestamp: '12:00',
        },
    ]);

    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleKeyPress = (key: string) => {
        if (screen !== 'COMPOSE') return;

        if (activeInput === 'RECIPIENT') {
            if (/^[0-9*#]$/.test(key)) {
                setRecipient((prev) => prev + key);
            }
        } else {
            const { newText, newState } = processKeyPress(key, content, multiTapState);
            setContent(newText);
            setMultiTapState(newState);
        }
    };

    const handleClearOrCancel = () => {
        if (screen === 'COMPOSE') {
            if (activeInput === 'CONTENT') {
                if (content.length > 0) {
                    setContent((prev) => prev.slice(0, -1));
                    setMultiTapState(INITIAL_MULTI_TAP_STATE);
                } else {
                    setActiveInput('RECIPIENT');
                }
            } else if (activeInput === 'RECIPIENT') {
                if (recipient.length > 0) {
                    setRecipient((prev) => prev.slice(0, -1));
                } else {
                    resetComposeForm();
                    setScreen('HOME');
                }
            }
        } else if (screen === 'INBOX' || screen === 'VIEW_SMS') {
            setScreen('HOME');
        }
    };

    const resetComposeForm = () => {
        setRecipient('');
        setContent('');
        setActiveInput('RECIPIENT');
        setMultiTapState(INITIAL_MULTI_TAP_STATE);
    };

    const handleSend = () => {
        if (!content.trim() || !recipient.trim()) return;

        const newSms: SmsMessage = {
            id: Date.now().toString(),
            senderNumber: 'JA',
            recipientNumber: recipient,
            content: content,
            timestamp: currentTime,
        };

        setMessages((prev) => [newSms, ...prev]);
        resetComposeForm();
        setScreen('INBOX');
    };

    return (
        <div style={styles.pageBackground}>
            <div style={styles.phoneBody}>
                <div style={styles.brand}>NOKIA</div>

                {/* Ekran LCD */}
                <div style={styles.lcdScreen}>
                    <div style={styles.statusBar}>
                        <span>📶 Signal</span>
                        <span>{currentTime || '12:00'}</span>
                        <span>🔋</span>
                    </div>
                    <hr style={{ borderColor: '#2b3e2b', margin: '4px 0' }} />

                    <div style={styles.screenContent}>
                        {/* MENU GŁÓWNE */}
                        {screen === 'HOME' && (
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ margin: '6px 0', fontSize: '13px' }}>Menu Nokia</h3>
                                <button
                                    style={styles.retroBtn}
                                    onClick={() => {
                                        resetComposeForm();
                                        setScreen('COMPOSE');
                                    }}
                                >
                                    1. Napisz SMS
                                </button>
                                <button style={styles.retroBtn} onClick={() => setScreen('INBOX')}>
                                    2. Skrzynka ({messages.length})
                                </button>
                            </div>
                        )}

                        {/* SMS */}
                        {screen === 'COMPOSE' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Nowy SMS</span>
                                    <button
                                        onClick={() => setActiveInput(activeInput === 'RECIPIENT' ? 'CONTENT' : 'RECIPIENT')}
                                        style={styles.switchBtn}
                                    >
                                        ⬇️ Zmień pole
                                    </button>
                                </div>

                                {/* Pole numeru */}
                                <div
                                    style={{
                                        ...styles.inputField,
                                        borderColor: activeInput === 'RECIPIENT' ? '#0f380f' : 'transparent',
                                        backgroundColor: activeInput === 'RECIPIENT' ? '#8bac0f' : 'transparent',
                                    }}
                                    onClick={() => setActiveInput('RECIPIENT')}
                                >
                                    <span style={{ fontSize: '10px' }}>Do: </span>
                                    <b>{recipient || '_'}</b>
                                </div>

                                {/* Pole treści */}
                                <div
                                    style={{
                                        ...styles.inputField,
                                        minHeight: '40px',
                                        marginTop: '4px',
                                        borderColor: activeInput === 'CONTENT' ? '#0f380f' : 'transparent',
                                        backgroundColor: activeInput === 'CONTENT' ? '#8bac0f' : 'transparent',
                                    }}
                                    onClick={() => setActiveInput('CONTENT')}
                                >
                                    <span style={{ fontSize: '10px', display: 'block' }}>Treść:</span>
                                    <b>{content || '_'}</b>
                                </div>
                            </div>
                        )}

                        {/* SKRZYNKA ODBIORCZA */}
                        {screen === 'INBOX' && (
                            <div>
                                <strong style={{ fontSize: '11px' }}>Skrzynka odbiorcza:</strong>
                                <div style={{ marginTop: '4px', maxHeight: '90px', overflowY: 'auto' }}>
                                    {messages.length === 0 ? (
                                        <div style={{ fontSize: '11px', color: '#2b3e2b' }}>Brak wiadomości</div>
                                    ) : (
                                        messages.map((m) => (
                                            <div
                                                key={m.id}
                                                style={styles.smsItem}
                                                onClick={() => {
                                                    setSelectedSms(m);
                                                    setScreen('VIEW_SMS');
                                                }}
                                            >
                                                <b>{m.senderNumber}</b>: {m.content.slice(0, 12)}...
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ODCZYT WIADOMOŚCI */}
                        {screen === 'VIEW_SMS' && selectedSms && (
                            <div>
                                <div style={{ fontSize: '10px', borderBottom: '1px solid #0f380f', paddingBottom: '2px' }}>
                                    Od: <b>{selectedSms.senderNumber}</b> ({selectedSms.timestamp})
                                </div>
                                <div style={{ fontSize: '12px', marginTop: '6px', wordBreak: 'break-all' }}>
                                    {selectedSms.content}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* PRZYCISKI NAWIGACYJNE NA OBUDOWIE */}
                <div style={styles.navSection}>
                    {screen === 'COMPOSE' && (
                        <>
                            <button style={styles.navBtn} onClick={handleSend}>
                                Wyślij
                            </button>
                            <button style={styles.clearBtn} onClick={handleClearOrCancel} title="C / Anuluj">
                                C
                            </button>
                        </>
                    )}

                    {screen === 'HOME' && (
                        <button style={{ ...styles.navBtn, width: '100%' }} onClick={() => setScreen('COMPOSE')}>
                            Napisz SMS
                        </button>
                    )}

                    {(screen === 'INBOX' || screen === 'VIEW_SMS') && (
                        <>
                            <button style={styles.navBtn} onClick={() => setScreen('HOME')}>
                                Menu
                            </button>
                            <button style={styles.clearBtn} onClick={() => setScreen(screen === 'VIEW_SMS' ? 'INBOX' : 'HOME')}>
                                Wstecz
                            </button>
                        </>
                    )}
                </div>

                {/* KLAWIATURA NUMERYCZNA */}
                <div style={styles.keypad}>
                    {KEY_LAYOUT.map((item) => (
                        <button
                            key={item.key}
                            style={styles.key}
                            onClick={() => handleKeyPress(item.key)}
                        >
                            <div>{item.key}</div>
                            <div style={styles.keySubtext}>
                                {item.chars.slice(0, 3).join('')}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    pageBackground: {
        minHeight: '100vh',
        backgroundColor: '#121212',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'monospace',
    },
    phoneBody: {
        width: '300px',
        backgroundColor: '#3b434c',
        borderRadius: '30px',
        padding: '20px',
        border: '4px solid #222',
    },
    brand: {
        textAlign: 'center',
        color: '#d1d5db',
        fontWeight: 'bold',
        fontSize: '20px',
        marginBottom: '10px',
    },
    lcdScreen: {
        backgroundColor: '#9bbc0f',
        color: '#0f380f',
        padding: '10px',
        borderRadius: '10px',
        border: '3px solid #8bac0f',
        minHeight: '160px',
    },
    statusBar: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '10px',
        fontWeight: 'bold',
    },
    screenContent: {
        marginTop: '5px',
    },
    inputField: {
        border: '2px solid transparent',
        padding: '3px 5px',
        borderRadius: '4px',
        cursor: 'pointer',
        wordBreak: 'break-all',
    },
    switchBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#0f380f',
        fontSize: '9px',
        fontWeight: 'bold',
        cursor: 'pointer',
        padding: 0,
    },
    smsItem: {
        padding: '3px',
        borderBottom: '1px dashed #0f380f',
        fontSize: '11px',
        cursor: 'pointer',
    },
    retroBtn: {
        display: 'block',
        width: '100%',
        backgroundColor: '#8bac0f',
        border: '1px solid #0f380f',
        color: '#0f380f',
        padding: '4px',
        marginTop: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    navSection: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
        marginTop: '15px',
    },
    navBtn: {
        flex: 2,
        backgroundColor: '#1f2937',
        color: '#fff',
        border: '2px solid #111827',
        borderRadius: '12px',
        padding: '8px 0',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    clearBtn: {
        flex: 1,
        backgroundColor: '#991b1b',
        color: '#fff',
        border: '2px solid #7f1d1d',
        borderRadius: '12px',
        padding: '8px 0',
        fontWeight: 'bold',
        fontSize: '14px',
        cursor: 'pointer',
    },
    keypad: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginTop: '10px',
    },
    key: {
        backgroundColor: '#1f2937',
        color: '#fff',
        border: '2px solid #111827',
        borderRadius: '8px',
        padding: '8px 0',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        textAlign: 'center',
    },
    keySubtext: {
        fontSize: '9px',
        color: '#9ca3af',
        marginTop: '2px',
    },
};