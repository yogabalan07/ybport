import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
// Dev/preview-only mirror of the production Cloud Function.
// Both delegate to the same shared fetcher so local and deployed behavior never drift.
import {buildContributionsPayload} from './functions/contributions.js';

function githubContributionsPlugin(): Plugin {
  const handler = async (req: any, res: any, next: any) => {
    const url = req.url?.split('?')[0];
    if (url === '/api/github-contributions') {
      try {
        const payload = await buildContributionsPayload(process.env.GITHUB_TOKEN || '');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(payload));
      } catch {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            success: false,
            message: 'Upstream GitHub contribution fetch failed. Retry shortly.',
          })
        );
      }
      return;
    }
    next();
  };

  return {
    name: 'github-contributions-plugin',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), githubContributionsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

