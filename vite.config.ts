import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { terser } from "rollup-plugin-terser";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// const root = resolve(process.cwd());

// @ts-ignore
export default defineConfig(({ command, mode, ssrBuild }) => {
  return {
    plugins: [
      Components({
        dirs: ["src/renderer/components"],
        // resolvers: [AntDesignVueResolver()],
      }),
      vue(),
    ],
    // root,
    // base: "",
    server: {
      host: "0.0.0.0",
      port: 9024,
    },
    resolve: {
      alias: {
        "@": resolve("src/renderer"),
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
