import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from "@next/eslint-plugin-next";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "out/**",
      "next-env.d.ts",
    ],
  },

  ...compat.extends("next/core-web-vitals"),
  ...tseslint.configs.recommended,

  // no any, log, unused vars, null assertion, unused expressions
  // must function return type, deps
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      import: importPlugin,
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off",

      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-unused-expressions": "error",

      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
      react: {
        version: "detect",
      },
    },
  },

  // no function return type for tsx
  {
    files: ["**/*.tsx", "**/page.tsx", "**/layout.tsx"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },

  // no img (testing)
  {
    files: ["**/*.test.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },

  // FSD structure
  ...compat.config({
    plugins: ["@conarti/feature-sliced"],
    extends: ["plugin:@conarti/feature-sliced/recommended"],
    rules: {
      "@conarti/feature-sliced/layers-slices": "error",
      "@conarti/feature-sliced/absolute-relative": "error",
      "@conarti/feature-sliced/public-api": "error",
    },
  }),
];

export default eslintConfig;
