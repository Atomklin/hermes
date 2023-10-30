import express from "express";
import { join } from "node:path";

import { ensureBasicAuth } from "./All-Purpose/middlewares";
import { globals } from "./Data/GlobalData";
import authentication from "./Routes/authentication";
import regiments from "./Routes/regiments";

export async function prepareRoutes(app: express.Application) {
  app.use("/api/auth", authentication);
  app.use("/api/regiments", ensureBasicAuth, regiments);

  if (globals.isProduction) {
    app.use("/", express.static(globals.clientDir));
    app.get("*", (_, res) => {
      res.sendFile(join(globals.clientDir, "index.html"));
    });

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