import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import helmet from "helmet";

import { globals } from "./data/GlobalData";
import { MAX_AGE, SessionStorage } from "./data/models/sessions";
import { setupPassport } from "./data/models/setup";
import { prepareRoutes } from "./routes";

const app = express();

// Initialization function
void (async function () {
  await globals.loadDatabase();

  app.use(helmet());
  app.use(rateLimit({
    limit: parseInt(process.env["RL_MAX_CONNECTIONS"]!),
    windowMs: parseInt(process.env["RL_WINDOW_MS"]!)
  }));

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(session({
    store: new SessionStorage(globals.sequelize.models.sessions),
    secret: process.env["SESSION_SECRET"]!.split(","),
    saveUninitialized: false,
    name: "sessionId",
    resave: false,
    cookie: { 
      secure: globals.isProduction, // Https is expected for this
      maxAge: MAX_AGE
    } 
  }));

  setupPassport(app, globals.sequelize);
  await prepareRoutes(app);

  const hostname = globals.hostname;
  const port = globals.port;

  app.listen(port, hostname, () => {
    console.info("Listening to http://" + hostname + ":" + port);
  });
})();
