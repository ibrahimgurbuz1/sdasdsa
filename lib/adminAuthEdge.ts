type AdminSessionPayload = {
  adminId: string;
  email: string;
  role: string;
  exp: number;
};

function fromBase64Url(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return atob(padded);
}

function toBase64UrlFromBytes(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function sign(payloadBase64: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadBase64));
  return toBase64UrlFromBytes(new Uint8Array(sigBuffer));
}

export async function verifyAdminSessionTokenEdge(
  token: string | undefined,
  secret: string
): Promise<AdminSessionPayload | null> {
  if (!token) return null;

  const [payloadBase64, tokenSignature] = token.split('.');
  if (!payloadBase64 || !tokenSignature) return null;

  const expectedSignature = await sign(payloadBase64, secret);
  if (expectedSignature !== tokenSignature) {
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