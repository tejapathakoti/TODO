import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals:
      { ...globals.browser, ngDevMode: "readonly" },
    }, 
  rules: {
    "no-console": "warn",
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "spaced-comment": ["error", "always", { markers: ["/"] }],
    "max-len": ["warn", { code: 200 }],
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-expressions": "warn",
  },
 },
  ...tseslint.configs.recommended,
]);