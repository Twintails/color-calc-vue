import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
});

/**
 * 
 * import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  
  test: {
    projects: [
      // matches every folder and file inside the `packages` folder
      "src/** /*.{spec,test}.{ts,tsx}",
      {
        // add "extends: true" to inherit the options from the root config
        extends: true,
        test: {
          include: ["src/** /*.spec.ts"],
          // it is recommended to define a name when using inline configs
          name: "ui-integration",
          environment: "jsdom",
        },
      },
      {
        // add "extends: true" to inherit the options from the root config
        extends: true,
        test: {
          include: ["src/** /*.test.ts"],
          // it is recommended to define a name when using inline configs
          name: "unit",
          environment: "node",
        },
      },
      //   {
      //     test: {
      //       include: ['tests/** /*.{node}.test.{ts,js}'],
      //       // color of the name label can be changed
      //       name: { label: 'node', color: 'green' },
      //       environment: 'node',
      //     }
      //   }
    ],
  },
});

 */
