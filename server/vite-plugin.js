import { routeApi, sendJson } from './http.js';

export function dashboardApiPlugin() {
  return {
    name: 'oi-dashboard-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];
        if (url === '/oi') {
          res.statusCode = 302;
          res.setHeader('Location', '/oi/');
          res.end();
          return;
        }
        next();
      });

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        if (!url?.startsWith('/api/')) return next();
        try {
          await routeApi(req, res, url);
        } catch (error) {
          if (!res.headersSent && !res.writableEnded) {
            sendJson(res, error.status || 500, { error: error.message || 'Request failed.' });
          }
        }
      });
    },
  };
}
