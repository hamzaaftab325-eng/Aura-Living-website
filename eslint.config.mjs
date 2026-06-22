/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ["next/core-web-vitals", "next/typescript"],
  rules: {
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};

export default config;
