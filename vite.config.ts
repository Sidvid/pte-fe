import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import * as path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const appType = env.VITE_APP_TYPE;

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: Number(env.VITE_PORT) || 3000,
      open: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@admin": path.resolve(__dirname, "src/modules/admin"),
        "@students": path.resolve(__dirname, "src/modules/students"),
        "@assets": path.resolve(__dirname, "src/assets"),
      },
    },
    build: {
      outDir: `dist/${appType}`,
    },
  };
});
