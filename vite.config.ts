import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sentryVitePlugin({
    org: "jpark",
    project: "deeeply-fe"}),
    svgr(),
    VitePWA({ 
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],
     })
  ],

  build: {
    sourcemap: true
  }
})