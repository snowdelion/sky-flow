import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [path.resolve(__dirname, "./vitest.setup.ts")],
    alias: {
      "server-only": path.resolve(
        __dirname,
        "./src/shared/lib/testing/mocks/empty.ts",
      ),
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@entities": path.resolve(__dirname, "./src/entities"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@widgets": path.resolve(__dirname, "./src/widgets"),
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/node_modules/**",
        "**/index.ts",
        "**/*.types.ts",
        "**/*.dto.ts",
        "**/types/**",
        "**/assets/**",
        "src/app/providers/**",
        "**/*.d.ts",
        "vite.config.ts",
        "vitest.setup.ts",
      ],
    },
  },
});

process.env.TZ = "UTC";
