import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      port: 3002,
      strictPort: true,
      open: true,
    },

  
    css: {
      postcss: "./postcss.config.cjs",
    },

    plugins: [
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin"],
        },
      }),
    ],

    preview: {
      port: 3003,
      strictPort: true,
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@context": path.resolve(__dirname, "./src/context"),
      },
    },

    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@emotion/react",
        "@emotion/styled",
        "@mui/material",
      ],
    },

    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            vendor: ["@emotion/react", "@emotion/styled", "@mui/material"],
          },
        },
      },
    },

    define: {
      "process.env": Object.fromEntries(
        Object.entries(env).filter(([key]) => key.startsWith("VITE_"))
      ),
    },
  };
});
