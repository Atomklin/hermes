import express from "express";
import session from "express-session";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { MAX_AGE, SessionStorage } from "./Data/Collections/Sessions.js";
import { globals } from "./Data/GlobalData.js";
import { preparePassport } from "./Data/passport.js";
import authentication from "./Routes/authentication.js";

const app = express();

// Initialization function
void (async function () {
  await globals.loadDatabase();

  if (globals.isProduction) {
    const publicDir = join(globals.frontEndDir, "client");
    const entryFilePath = join(globals.frontEndDir, "server", "entry.mjs");
    const { handler: ssrHandler } = await import(
      pathToFileURL(entryFilePath).toString()
    );

    app.use("/", express.static(publicDir));
    app.use(ssrHandler);
  }
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(session({
    store: new SessionStorage(globals.sequelize),
    secret: globals.sessionSecret,
    saveUninitialized: false,
    resave: false,
    cookie: { 
      secure: globals.isProduction, // Https is expected for this
      maxAge: MAX_AGE // 1 Day
    } 
  }));

  preparePassport(app, globals.sequelize);
  
  app.use("/api/auth", authentication);
  app.disable("x-powered-by");

  if (globals.isProduction) {
    // Handle error, so stack traces don't leak out to user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((error: Error, _r: unknown, res: express.Response, _n: unknown) => {
      console.error(error);
      res.status(500);
      res.type("json");
      res.send({ reason: error.message });
    });

    // Redirect users to /404 if the asked page is missing.
    app.all("*", (_, res) => {
      res.redirect("/404");
    });
  }


  const hostname = globals.hostname;
  const port = globals.port;

  app.listen(port, hostname, () => {
    console.log("Listening to http://" + hostname + ":" + port);
  });
})();
