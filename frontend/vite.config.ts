import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@app', replacement: path.resolve(__dirname, './src/app') },
      { find: '@pages', replacement: path.resolve(__dirname, './src/pages') },
      { find: '@components', replacement: path.resolve(__dirname, './src/components') },
      { find: '@worlds', replacement: path.resolve(__dirname, './src/worlds') },
      { find: '@data', replacement: path.resolve(__dirname, './src/data') },
      { find: '@features', replacement: path.resolve(__dirname, './src/features') },
      { find: '@hooks', replacement: path.resolve(__dirname, './src/hooks') },
      { find: '@services', replacement: path.resolve(__dirname, './src/services') },
      { find: '@store', replacement: path.resolve(__dirname, './src/store') },
      { find: '@providers', replacement: path.resolve(__dirname, './src/providers') },
      { find: '@context', replacement: path.resolve(__dirname, './src/context') },
      { find: '@types', replacement: path.resolve(__dirname, './src/types') },
      { find: '@utils', replacement: path.resolve(__dirname, './src/utils') },
      { find: '@styles', replacement: path.resolve(__dirname, './src/styles') },
      { find: '@theme', replacement: path.resolve(__dirname, './src/theme') },
      { find: '@assets', replacement: path.resolve(__dirname, './src/assets') },
      { find: '@constants', replacement: path.resolve(__dirname, './src/constants') },
      { find: '@config', replacement: path.resolve(__dirname, './src/config') },
      { find: '@lib', replacement: path.resolve(__dirname, './src/lib') },
      { find: '@api', replacement: path.resolve(__dirname, './src/api') },
      { find: '@guards', replacement: path.resolve(__dirname, './src/guards') },
      { find: '@routes', replacement: path.resolve(__dirname, './src/routes') },
      { find: '@layouts', replacement: path.resolve(__dirname, './src/layouts') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
