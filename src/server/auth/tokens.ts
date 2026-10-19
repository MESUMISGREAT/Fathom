import { createHash, randomBytes } from 'node:crypto';

/** 256-bit random session token for the cookie. */
export const newSessionToken = () => randomBytes(32).toString('base64url');

/** Only the hash is stored, so a database leak does not leak live sessions. */
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export const SESSION_DAYS = 30;
/** Sessions are extended when used within this many days of expiry. */
export const SESSION_RENEW_DAYS = 15;
