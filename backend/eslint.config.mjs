import { defineConfig } from "eslint/config";
import globals from "globals";


export default defineConfig([
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
       globals: globals.node, 
      },
      rules: {
        "no-console": "warn",    // Warn on console statements
        "semi": ["error", "always"],  // Enforce semicolons
        "quotes": ["error", "double"], // Enforce single quotes
        "spaced-comment": ["error", "always", { markers: ["/"] }],
        "max-len": ["warn", { code: 100 }],  // Max line length of 100 characters
        "no-unused-vars": "warn", // Warn about unused variables
      },
     },
]);