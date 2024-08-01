import { defineConfig } from 'vite'
import * as fs from 'fs';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 3000,
      https: (mode === "development") ? {
        key: fs.readFileSync("certs/localcert.key"),
        cert: fs.readFileSync("certs/localcert.pem")
      } : null,
    }
  }
})
