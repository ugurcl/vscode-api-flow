import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vscode: {
          bg: "var(--vscode-editor-background)",
          fg: "var(--vscode-editor-foreground)",
          border: "var(--vscode-panel-border)",
          input: {
            bg: "var(--vscode-input-background)",
            fg: "var(--vscode-input-foreground)",
            border: "var(--vscode-input-border)",
          },
          button: {
            bg: "var(--vscode-button-background)",
            fg: "var(--vscode-button-foreground)",
            hover: "var(--vscode-button-hoverBackground)",
          },
          sidebar: {
            bg: "var(--vscode-sideBar-background)",
            fg: "var(--vscode-sideBar-foreground)",
          },
          badge: {
            bg: "var(--vscode-badge-background)",
            fg: "var(--vscode-badge-foreground)",
          },
          list: {
            hover: "var(--vscode-list-hoverBackground)",
            active: "var(--vscode-list-activeSelectionBackground)",
            activeFg: "var(--vscode-list-activeSelectionForeground)",
          },
          tab: {
            active: "var(--vscode-tab-activeBackground)",
            inactive: "var(--vscode-tab-inactiveBackground)",
          },
        },
      },
      fontSize: {
        vs: "var(--vscode-font-size, 13px)",
      },
      fontFamily: {
        vs: "var(--vscode-font-family)",
        mono: "var(--vscode-editor-font-family, monospace)",
      },
    },
  },
  plugins: [],
} satisfies Config;
