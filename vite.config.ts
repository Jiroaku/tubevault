import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  publicDir: 'public',
  build: {
    copyPublicDir: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined
      }
    }
  }
})
