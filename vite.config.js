import { defineConfig, loadEnv } from 'vite';
import { dashboardApiPlugin } from './server/vite-plugin.js';

const ENV_KEYS = ['ADMIN_PASSWORD', 'GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO', 'GITHUB_BRANCH'];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of ENV_KEYS) {
    if (env[key]) process.env[key] = env[key];
  }

  return {
    appType: 'mpa',
    root: '.',
    publicDir: 'public',
    plugins: [dashboardApiPlugin()],
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: 'index.html',
          oi: 'oi/index.html',
        },
      },
    },
  };
});
