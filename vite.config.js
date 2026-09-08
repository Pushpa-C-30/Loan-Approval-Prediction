import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  preview: {
    allowedHosts: ['loan-approval-prediction-6-ik10.onrender.com']
  }
});