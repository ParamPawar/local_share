import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// vite.config.js
export default {
  server: {
    host: true, // enables access via LAN IP (like 192.168.x.x)
    port: 5173
  }
};
