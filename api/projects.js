import { handleProjects, sendJson } from '../server/http.js';

export default async function handler(req, res) {
  try {
    await handleProjects(req, res);
  } catch (error) {
    sendJson(res, error.status || 500, { error: error.message || 'Request failed.' });
  }
}
