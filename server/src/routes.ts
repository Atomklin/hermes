import express from "express";
import { join } from "node:path";

import { ensureBasicAuth } from "./all-purpose/middlewares";
import { globals } from "./data/GlobalData";
import authentication from "./routes/authentication";
import regiments from "./routes/regiments";
import users from "./routes/users";

export async function prepareRoutes(app: express.Application) {
  app.use("/api/auth", authentication);
  app.use("/api/users", ensureBasicAuth, users);
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
      res.status(404);
      res.sendFile(join(globals.clientDir, "404.html"));
    });
  }
}