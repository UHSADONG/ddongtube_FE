import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

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
      manifest: {
        name: 'Deeeply',
        short_name: '디플리',
        description: '안 들어오면..나..24시간 뒤에..터진다?ㅋ',
        icons: [
          {
            src: './favicon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './favicon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        start_url: '/start',
        display: 'standalone',
        background_color: '#1F1F20',
        theme_color: '#D93F0F'
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 7000000, // 7MB로 설정 (필요한 크기에 맞게 조절)
      },
     }),
     tsconfigPaths()
  ],

  build: {
    sourcemap: true
  }
})