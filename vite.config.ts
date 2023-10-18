import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { terser } from "rollup-plugin-terser";

const root = resolve(process.cwd());

// @ts-ignore
export default defineConfig(({ command, mode, ssrBuild }) => {
  return {
    plugins: [vue()],
    root,
    base: "",
    server: {
      port: 9024,
    },
    resolve: {
      alias: {
        "@": resolve(root, "src/renderer"),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    build: {
      emptyOutDir: true,
      rollupOptions: {
        plugins: [
          terser({
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          }),
        ],
      },
      outDir: "output/dist/renderer",
    },
  };
});
