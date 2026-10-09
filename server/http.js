import {
  adminPassword,
  clearSessionCookie,
  isAuthed,
  passwordsMatch,
  sessionCookie,
  sessionToken,
} from './auth.js';
import { readProjects, writeImage, writeProjects } from './store.js';
import { validateImageUpload, validateProjects } from './validate.js';

const MAX_BODY = 4_500_000;

export function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function readBuffer(req) {
  if (Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
  if (typeof req.body === 'string') return Promise.resolve(Buffer.from(req.body));
  if (req.body && typeof req.body === 'object') return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error('Request is too large.'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export async function readJson(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  const buffer = await readBuffer(req);
  if (!buffer?.length) return {};
  try {
    return JSON.parse(buffer.toString('utf8'));
  } catch {
    const error = new Error('Request body must be JSON.');
    error.status = 400;
    throw error;
  }
}

function requireAuth(req) {
  if (!adminPassword()) {
    const error = new Error('ADMIN_PASSWORD is not set.');
    error.status = 503;
    throw error;
  }
  if (!isAuthed(req)) {
    const error = new Error('Sign in required.');
    error.status = 401;
    throw error;
  }
}

export async function handleAuth(req, res) {
  if (req.method === 'GET') {
    sendJson(res, 200, { ok: isAuthed(req) });
    return;
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearSessionCookie());
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  const password = adminPassword();
  if (!password) {
    sendJson(res, 503, { error: 'ADMIN_PASSWORD is not set.' });
    return;
  }

  const body = await readJson(req);
  if (!passwordsMatch(body.password || '', password)) {
    sendJson(res, 401, { error: 'Wrong password.' });
    return;
  }

  res.setHeader('Set-Cookie', sessionCookie(sessionToken(password)));
  sendJson(res, 200, { ok: true });
}

export async function handleProjects(req, res) {
  requireAuth(req);

  if (req.method === 'GET') {
    const projects = await readProjects();
    sendJson(res, 200, { projects });
    return;
  }

  if (req.method === 'PUT') {
    const body = await readJson(req);
    const projects = validateProjects(body.projects);
    const saved = await writeProjects(projects);
    sendJson(res, 200, { projects, saved });
    return;
  }

  sendJson(res, 405, { error: 'Method not allowed.' });
}

export async function handleUpload(req, res) {
  requireAuth(req);
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  const body = await readJson(req);
  const image = validateImageUpload(body);
  const saved = await writeImage(image.name, image.buffer);
  sendJson(res, 200, { path: `/images/${image.name}`, saved });
}

export async function routeApi(req, res, url) {
  if (url === '/api/auth') return handleAuth(req, res);
  if (url === '/api/projects') return handleProjects(req, res);
  if (url === '/api/upload') return handleUpload(req, res);
  sendJson(res, 404, { error: 'Not found.' });
}
