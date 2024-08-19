import { defineConfig } from 'astro/config';
import vue from "@astrojs/vue";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), react()],
  vite: {
    ssr: {
      noExternal: ['lucide-react', 'lucide-vue-next'] // Add lucide-vue-next here
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react', 'lucide-vue-next'] // Add lucide-vue-next here
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'vue-vendor': ['vue'],
            'lucide-vue-next-vendor': ['lucide-vue-next'] // Optionally, separate the chunk for lucide-vue-next
          }
        }
      }
    }
  },
  // Enable on-demand rendering for better performance
  output: 'server',
  // Add caching headers for better performance
  headers: {
    '/*.js': [{
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable'
    }],
    '/*.css': [{
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable'
    }]
  },
  adapter: vercel()
});
