import { createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';

type AdminSessionPayload = {
  adminId: string;
  email: string;
  role: string;
  exp: number;
};

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7;

function getAdminAuthSecret(): string {
  return process.env.ADMIN_AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'dev-admin-secret-change-me';
}

function toBase64Url(input: string): string {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64').toString('utf8');
}

function sign(payloadBase64: string, secret: string): string {
  const signature = createHmac('sha256', secret).update(payloadBase64).digest('base64');
  return signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function createAdminSessionToken(
  payload: Omit<AdminSessionPayload, 'exp'>,
  ttlSeconds = DEFAULT_TTL_SECONDS
): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const fullPayload: AdminSessionPayload = { ...payload, exp };
  const payloadBase64 = toBase64Url(JSON.stringify(fullPayload));
  const signature = sign(payloadBase64, getAdminAuthSecret());
  return `${payloadBase64}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined): AdminSessionPayload | null {
  if (!token) return null;

  const [payloadBase64, tokenSignature] = token.split('.');
  if (!payloadBase64 || !tokenSignature) return null;

  const expectedSignature = sign(payloadBase64, getAdminAuthSecret());
  const a = Buffer.from(tokenSignature);
  const b = Buffer.from(expectedSignature);

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(payloadBase64)) as AdminSessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function getAdminSessionFromRequest(request: NextRequest): AdminSessionPayload | null {
  const token = request.cookies.get('adminAuth')?.value;
  return verifyAdminSessionToken(token);
}

export type { AdminSessionPayload };