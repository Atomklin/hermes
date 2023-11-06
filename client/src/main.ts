import "./global.css";

import { _, init, register } from "svelte-i18n";

import App from "./App.svelte";

register("en", () => import("./assets/languages/en.json"));
init({ fallbackLocale: "en" });

const app = new App({
  target: document.getElementById('app')!,
})

export default app
