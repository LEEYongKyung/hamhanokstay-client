import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// Vite.config.js : 프로젝트의 엔진
// Vite 프로젝트의 빌드, 개발 서버, 및 각 종 설정을 총괄하는 파일 
// 플러그인 설정, base경로 설정, 개발서버 옵션(port 변경), 경로별칭등을 설정 
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 경로 별칭을 생성하여 파일들에 대한 경로를 손쉽게 접근하도록 설정 eg, '@/component/Header.jsx'
    },
  },
})