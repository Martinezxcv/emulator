export const KEY_LAYOUT: { key: string; chars: string[] }[] = [
    { key: '1', chars: ['.', ',', '?', '!', '1'] },
    { key: '2', chars: ['a', 'b', 'c', '2'] },
    { key: '3', chars: ['d', 'e', 'f', '3'] },
    { key: '4', chars: ['g', 'h', 'i', '4'] },
    { key: '5', chars: ['j', 'k', 'l', '5'] },
    { key: '6', chars: ['m', 'n', 'o', '6'] },
    { key: '7', chars: ['p', 'q', 'r', 's', '7'] },
    { key: '8', chars: ['t', 'u', 'v', '8'] },
    { key: '9', chars: ['w', 'x', 'y', 'z', '9'] },
    { key: '*', chars: ['*'] },
    { key: '0', chars: [' ', '0'] },
    { key: '#', chars: ['#'] },
];

export interface MultiTapState {
    lastKey: string | null;
    charIndex: number;
    lastTimestamp: number;
}

export const INITIAL_MULTI_TAP_STATE: MultiTapState = {
    lastKey: null,
    charIndex: 0,
    lastTimestamp: 0,
};

const TIMEOUT_MS = 800;

export function processKeyPress(
    key: string,
    currentText: string,
    state: MultiTapState,
    now: number = Date.now()
): { newText: string; newState: MultiTapState } {
    const keyConfig = KEY_LAYOUT.find((item) => item.key === key);
    const characters = keyConfig?.chars;

    if (!characters) {
        return { newText: currentText, newState: INITIAL_MULTI_TAP_STATE };
    }

    const isSameKey = state.lastKey === key;
    const isWithinTimeout = now - state.lastTimestamp < TIMEOUT_MS;

    if (isSameKey && isWithinTimeout) {
        const nextCharIndex = (state.charIndex + 1) % characters.length;
        const nextChar = characters[nextCharIndex];
        const updatedText = currentText.slice(0, -1) + nextChar;

        return {
            newText: updatedText,
            newState: {
                lastKey: key,
                charIndex: nextCharIndex,
                lastTimestamp: now,
            },
        };
    } else {
        const firstChar = characters[0];

        return {
            newText: currentText + firstChar,
            newState: {
                lastKey: key,
                charIndex: 0,
                lastTimestamp: now,
            },
        };
    }
}