import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'/hamhanokstay-client/', // Github Page용
  optimizeDeps: {
    exclude: ['fsevents'],
  },
  server: {
    proxy: {
      '/agoda': {
        target: 'https://ycs.agoda.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/agoda/, ''),
      },
      '/airbnb': {
        target: 'https://www.airbnb.co.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/airbnb/, ''),
      },
      '/booking': {
        target: 'https://ical.booking.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/booking/, ''),
      },
    },
  },
})