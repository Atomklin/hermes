import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
import svelte from "@astrojs/svelte";

import { createProxyMiddleware } from "http-proxy-middleware"

function devServerProxy() {
  function onServerStart({ server }) {
    const apiProxy = createProxyMiddleware("http://127.0.0.1:3000/api");
    server.middlewares.use(apiProxy);
  }

  return {
    hooks: { "astro:server:setup": onServerStart },
    name: "dev-server-proxy"
  }
}


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte(), devServerProxy()],
  output: "server",
  adapter: node({
    mode: "middleware"
  })
});