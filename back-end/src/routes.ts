import express from "express";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { ensureBasicAuth } from "./All-Purpose/middlewares.js";
import { globals } from "./Data/GlobalData.js";
import authentication from "./Routes/authentication.js";
import regiments from "./Routes/regiments.js";

export async function prepareRoutes(app: express.Application) {
  app.use("/api/auth", authentication);
  app.use("/api/regiments", ensureBasicAuth, regiments);

  if (globals.isProduction) {
    const publicDir = join(globals.frontEndDir, "client");
    const entryFilePath = join(globals.frontEndDir, "server", "entry.mjs");
    const { handler: ssrHandler } = await import(
      pathToFileURL(entryFilePath).toString()
    );

    app.use("/", express.static(publicDir));
    app.use(ssrHandler);

    // Handle error, so stack traces don't leak out to user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((error: Error, _r: unknown, res: express.Response, _n: unknown) => {
      console.error(error);
      res.sendStatus(500);
    });

    // Redirect users to /404 if the asked page is missing.
    app.all("*", (_, res) => {
      res.redirect("/404");
    });
  }
}