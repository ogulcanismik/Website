import { handleUpload, sendJson } from '../server/http.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export default async function handler(req, res) {
  try {
    await handleUpload(req, res);
  } catch (error) {
    sendJson(res, error.status || 500, { error: error.message || 'Request failed.' });
  }
}
