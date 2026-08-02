import crypto from 'crypto';

export interface DownloadTokenPayload {
  saleId: string;
  beatId: string;
  fileType: 'master' | 'stems' | 'preview';
  exp: number; // timestamp (ms) d'expiration
}

const SECRET = process.env.DOWNLOAD_TOKEN_SECRET || '';

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

export function createDownloadToken(payload: DownloadTokenPayload): string {
  if (!SECRET) throw new Error('DOWNLOAD_TOKEN_SECRET manquant dans les variables d\'environnement');
  const data = base64url(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifyDownloadToken(token: string): DownloadTokenPayload | null {
  if (!SECRET || !token) return null;
  const [data, signature] = token.split('.');
  if (!data || !signature) return null;

  const expectedSignature = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  // Comparaison en temps constant pour éviter les attaques de timing
  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload: DownloadTokenPayload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (Date.now() > payload.exp) return null; // expiré
    return payload;
  } catch {
    return null;
  }
}