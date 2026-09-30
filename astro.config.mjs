// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/** @type {import('vite').Plugin} */
const legacyDevPlugin = {
  name: 'legacy-dev-redirect',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/legacy' || req.url === '/legacy/') {
        res.writeHead(302, { Location: '/legacy/index.html' });
        res.end();
        return;
      }
      next();
    });
  }
};

// https://astro.build/config
export default defineConfig({
  site: 'https://bslfinance.co.in',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss(), legacyDevPlugin]
  }
});
