import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// Alvo do backend GCEI em dev. Pode ser sobrescrito por VITE_API_PROXY_TARGET.
const API_PROXY_TARGET =
  process.env.VITE_API_PROXY_TARGET ?? "http://localhost:3000"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Proxy de dev: o navegador fala same-origin com o Vite (/api/*) e o Vite
    // repassa para a API (http://localhost:3000), evitando CORS em dev. Os
    // cookies HttpOnly funcionam por serem same-origin para o navegador.
    // Em produção, use VITE_API_BASE_URL apontando para a API real (com CORS
    // configurado para a origem do front).
    proxy: {
      "/api": {
        target: API_PROXY_TARGET,
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/api/, ""),
      },
    },
  },
})
