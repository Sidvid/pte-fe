// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import * as path from "path";

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), "");
//   const appType = env.VITE_APP_TYPE;

//   return {
//     plugins: [react(), tailwindcss()],
//     server: {
//       port: Number(env.VITE_PORT) || 3000,
//     },
//     resolve: {
//       alias: {
//         "@": path.resolve(__dirname, "src"),
//         "@admin": path.resolve(__dirname, "src/modules/admin"),
//         "@students": path.resolve(__dirname, "src/modules/students"),
//         "@assets": path.resolve(__dirname, "src/assets"),
//       },
//     },
//     build: {
//       outDir: `dist/${appType}`,
//     },
//   };
// });

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import * as path from "path";
import mkcert from "vite-plugin-mkcert"; // 1. Add this import

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const appType = env.VITE_APP_TYPE;

  return {
    plugins: [
      react(),
      tailwindcss(),
      mkcert(), // 2. Add this to plugins
    ],
    server: {
      port: Number(env.VITE_PORT) || 3000,
      https: true, // 3. Add this
      host: "0.0.0.0", // 4. Important: Allows access from other devices (192.168.1.4)
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
