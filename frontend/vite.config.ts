import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: Number(process.env.VITE_FRONTEND_PORT) || 5173
  },
})
