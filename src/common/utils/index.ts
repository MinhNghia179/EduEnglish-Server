import { randomBytes } from 'crypto';

export const generateChannelId = (): string => {
    const random = randomBytes(16);
    const base64 = random
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    return `UC${base64}`;
}
