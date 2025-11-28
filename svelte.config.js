import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "404.html",
      precompress: false,
      strict: true,
    }),
    prerender: {
      handleHttpError: ({ path, message }) => {
        // Ignore missing favicon during prerender
        if (path === "/favicon.png") {
          return;
        }
        throw new Error(message);
      },
    },
  },
};

export default config;
