import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@app': path.resolve(__dirname, './src/app'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@data': path.resolve(__dirname, './src/data'),
            '@worlds': path.resolve(__dirname, './src/worlds'),
            '@components': path.resolve(__dirname, './src/components'),
            '@features': path.resolve(__dirname, './src/features'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@services': path.resolve(__dirname, './src/services'),
            '@store': path.resolve(__dirname, './src/store'),
            '@providers': path.resolve(__dirname, './src/providers'),
            '@context': path.resolve(__dirname, './src/context'),
            '@types': path.resolve(__dirname, './src/types'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@styles': path.resolve(__dirname, './src/styles'),
            '@theme': path.resolve(__dirname, './src/theme'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@constants': path.resolve(__dirname, './src/constants'),
            '@config': path.resolve(__dirname, './src/config'),
            '@lib': path.resolve(__dirname, './src/lib'),
            '@api': path.resolve(__dirname, './src/api'),
            '@guards': path.resolve(__dirname, './src/guards'),
            '@routes': path.resolve(__dirname, './src/routes'),
            '@layouts': path.resolve(__dirname, './src/layouts'),
        },
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
});
