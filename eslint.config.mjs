import js from "@eslint/js";
import nextConfig from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  /* ── Ignores ────────────────────────────────────── */
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/coverage/**",
      "**/.turbo/**",
      "**/prisma/generated/**",
      "**/next-env.d.ts",
    ],
  },

  /* ── Base JS rules ──────────────────────────────── */
  js.configs.recommended,

  /* ── TypeScript ─────────────────────────────────── */
  ...tseslint.configs.recommended,

  /* ── Next.js (includes React & React Hooks) ─────── */
  ...nextConfig.map((cfg) => ({
    ...cfg,
    files: ["apps/web/**/*.{ts,tsx,js,jsx,mjs}"],
    ...(cfg.rules?.["@next/next/no-html-link-for-pages"]
      ? {
        rules: {
          ...cfg.rules,
          "@next/next/no-html-link-for-pages": ["error", "apps/web/src/app"],
        },
      }
      : {}),
  })),

  /* ── Prettier – disable conflicting rules (must be last) */
  prettierConfig,

  /* ── Project-specific rules ─────────────────────── */
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  /* ── Allow console in seed/scripts ──────────────── */
  {
    files: ["**/prisma/seed.ts", "**/scripts/**"],
    rules: {
      "no-console": "off",
    },
  },
);
