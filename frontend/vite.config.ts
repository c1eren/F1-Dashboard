import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: "../",
  server: {
    port:  5173, //Number(process.env.VITE_FRONTEND_PORT) ||
    host: "0.0.0.0"
  },
})

    // export default defineConfig({
    //   plugins: [react(), tailwindcss()],
    //   server: {
    //     port:  5173, //Number(process.env.VITE_FRONTEND_PORT) ||
    //     host: "0.0.0.0",
    //     proxy: {
    //       '/api': {
    //         target: 'http://localhost:3001',
    //         changeOrigin: true,
    //         rewrite: (path) => path.replace(/^\/api/, ''),
    //       },
    //     },
    //   },
    // });
