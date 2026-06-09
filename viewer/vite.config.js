import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The viewer lives in `viewer/` and reads the markdown notes from the
// repo root (../phase-*/ and ../README.md). `server.fs.allow` lets the
// dev server read those files that live one level above the app root.
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    fs: {
      allow: [".."],
    },
  },
});
