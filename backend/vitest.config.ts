import { defineConfig } from "vitest/config";
 
export default defineConfig({
  test: {
    include: ["./src/**/*.test.{ts,js}"],
    // setupFiles: ["./src/setupTests.ts"],
    globals: true,
    reporters: [
      "default",
      "junit",
    ],
    outputFile: "./junit.xml",
    // suiteNameTemplate: "{title}",
    // classNameTemplate: "{classname}",
    // titleTemplate: "{title}"
  },
});
 
 