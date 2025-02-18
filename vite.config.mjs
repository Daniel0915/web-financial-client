import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
// https://vitejs.dev/config/
export default (({mode}) => {
    const env = loadEnv(mode, process.cwd());

    return defineConfig({
        optimizeDeps: {
            noDiscovery: true
        },
        plugins: [
            vue(),
            Components({
                resolvers: [PrimeVueResolver()]
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: {
            proxy: {
                '/api': {
                    target: env.VITE_APP_API_URL, // 실제 API 서버 주소
                    changeOrigin: true, // Cross-Origin 허용
                    rewrite: (path) => path.replace(/^\/api/, ''), // '/api' 제거
                }
            }
        }
    });
});
