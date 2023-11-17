import path from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as sass from 'sass'
import postcssGlobalData from '@csstools/postcss-global-data'
import postcssCustomMedia from 'postcss-custom-media'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 3000, // you can replace this port with any port
  },
  preview: {
    port: 4000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'dashesOnly',
    },
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
    postcss: {
      plugins: [
        postcssGlobalData({ files: ['./src/main.css'] }),
        postcssCustomMedia,
      ],
    },
  },
})
