import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "storybook-static"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // The application intentionally loads remote data and initializes modal forms in effects.
      // This compiler-oriented rule flags those conventional React patterns as errors.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["src/components/ui/**/*.{ts,tsx}", "src/routes/**/*.{ts,tsx}"],
    rules: {
      // UI primitives export variants and the route module exports a router by design.
      "react-refresh/only-export-components": "off",
    },
  },
]);
