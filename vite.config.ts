
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: process.env.NODE_ENV === 'development' ? '/' : '/scrum-pointing-poker/',
  server: {
    host: "::",
    port: 8080,
    watch: {
      ignored: ["**/node_modules/**", "**/dist/**", "**/src/components/ui/**"],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
