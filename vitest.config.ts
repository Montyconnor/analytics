import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    onConsoleLog(log, type) {
      // Suppress React act() warnings
      if (type === "stderr" && log.includes("act")) {
        return false;
      }
      // Suppress expected error messages from error handling tests
      if (type === "stderr" && log.includes("❌ Error fetching data")) {
        return false;
      }
      return true;
    },
  },
});
