import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: "../",
  server: {
    port: Number(process.env.VITE_FRONTEND_PORT) || 5173,
    host: "0.0.0.0"
  },
})
