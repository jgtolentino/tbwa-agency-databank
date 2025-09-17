import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      // Production guards: prevent mock imports in production components
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/mocks/**", "**/mock/**"],
              message: "Mock imports not allowed in production components. Use environment guards instead.",
            },
            {
              group: ["**/lib/mocks/**"],
              message: "Mock library imports forbidden in production. Check ENV.USE_MOCK before importing.",
            },
          ],
        },
      ],
      // Prevent direct mock usage without environment checks
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='mockData']",
          message: "Direct mock calls forbidden. Use fetchOrFallback() with environment guards.",
        },
      ],
    },
  }
);
