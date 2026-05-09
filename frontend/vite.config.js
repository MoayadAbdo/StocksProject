import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8063",
        changeOrigin: true
      }
    }
=======
    port: 5173
>>>>>>> f31afd343b5a1bc92cd50e1c5d73da5d87b5bd46
  }
});
