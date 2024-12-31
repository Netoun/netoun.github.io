import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://netoun.com',
  output: 'static',
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: {
      prefixDefaultLocale: true
    }
  },
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    react(),
    sitemap()
  ],
  vite: {
    resolve: {
      alias: {
        '@i18n': '/src/i18n',
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@utils': '/src/utils',
        '@assets': '/src/assets'
      }
    }
  }
});