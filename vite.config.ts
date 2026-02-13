import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      // SINAN PROTOCOL: PROXY TUNNEL
      // This tunnels API requests to the live WordPress backend during local development
      proxy: {
        '/wp-json': {
          target: 'https://hava-durumlari.tr', // LIVE Domain
          changeOrigin: true,
          secure: true,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log(`[Proxy] ${req.method} ${req.url} → ${options.target}${req.url}`);
            });
            proxy.on('error', (err, req) => {
              console.error('[Proxy Error]', err.message);
            });
          }
        }
      }
    },
    plugins: [
      react(),
      // analyze({ summaryOnly: true }) // Optional: Uncomment to see bundle size in terminal
    ],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false, // Disable source maps for production to save space
      minify: 'terser', // Use Terser for better minification
      manifest: true, // Enable manifest for PHP integration
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            charts: ['recharts'],
            maps: ['leaflet', 'react-leaflet'],
            ui: ['lucide-react', 'framer-motion']
          }
        }
      }
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
