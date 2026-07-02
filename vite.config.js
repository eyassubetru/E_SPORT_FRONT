import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      // Proxy all eStreamApi requests to the live Cloud Function
      '/eStreamApi': {
        target: 'https://us-central1-ereceipt-d4cf6.cloudfunctions.net',
        changeOrigin: true,
      },
      // You should do the same for authApi!
      '/authApi': {
        target: 'https://us-central1-ereceipt-d4cf6.cloudfunctions.net',
        changeOrigin: true,
      }
    }
  }
})
