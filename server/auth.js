import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'oi_session';
const MAX_AGE = 60 * 60 * 24 * 14;

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || '';
}

export function sessionToken(password) {
  return createHmac('sha256', password).update('oi-dashboard-v1').digest('hex');
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) {
    timingSafeEqual(right, right);
    return false;
  }
  return timingSafeEqual(left, right);
}

export function passwordsMatch(input, expected) {
  return safeEqual(input, expected);
}

export function readCookie(req, name) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return '';
}

export function isAuthed(req) {
  const password = adminPassword();
  if (!password) return false;
  const token = readCookie(req, COOKIE);
  if (!token) return false;
  return safeEqual(token, sessionToken(password));
}

export function sessionCookie(token) {
  const secure = process.env.VERCEL ? '; Secure' : '';
  return `${COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
}

export function clearSessionCookie() {
  const secure = process.env.VERCEL ? '; Secure' : '';
  return `${COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}
