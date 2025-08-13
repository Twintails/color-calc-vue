import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: { label: "unit", color: "green" },
          include: ["src/**/*.test.ts"],
          environment: "node",
          setupFiles: ["./vitest.setup.ts"],
        },
      },
      {
        plugins: [vue()],
        test: {
          name: { label: "ui-integration", color: "blue" },
          include: ["src/**/*.spec.ts"],
          environment: "jsdom",
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
    coverage: {
      reportsDirectory: "./coverage",
      reporter: [
        "lcov",
        "text",
        ["html", { subdir: "../docs/coverage/" }],
        "json",
        ["text-summary", { file: "./summary.txt" }],
      ],
    },
    reporters: process.env.GITHUB_ACTIONS
      ? [
          "basic",
          [
            "github-actions",
            {
              onWritePath(path) {
                return path.replace(
                  /^\/app\//,
                  `${process.env.GITHUB_WORKSPACE}/`,
                );
              },
            },
          ],
        ]
      : ["default"],
  },
});
