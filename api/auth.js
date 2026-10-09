import { handleAuth, sendJson } from '../server/http.js';

export default async function handler(req, res) {
  try {
    await handleAuth(req, res);
  } catch (error) {
    sendJson(res, error.status || 500, { error: error.message || 'Request failed.' });
  }
}
