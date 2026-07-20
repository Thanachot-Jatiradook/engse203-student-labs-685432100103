import { defineConfig } from "vite";

// Match the GitHub Pages subpath for this student repository.
const repositoryName = "engse203-student-labs-685432100103";

export default defineConfig({
  base: `/${repositoryName}/labs/week-02/`,
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});