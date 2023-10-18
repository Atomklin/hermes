import express from "express";
import { join } from "path";
import { pathToFileURL } from "url";

import { globals } from "./Data/GlobalData.js";

const app = express();

// Initialization function
void async function() {
  if (globals.isProduction) {
    const publicDir = join(globals.frontEndDir, "client");
    const entryFilePath = join(globals.frontEndDir, "server", "entry.mjs");
    const { handler: ssrHandler } = await import(pathToFileURL(entryFilePath).toString());

    app.use("/", express.static(publicDir));
    app.use(ssrHandler);  
  }
  

  await globals.loadDatabase();
  
  
  // Redirect users to /404 if the asked page is missing.
  app.all("*", (_, res) => {
    res.redirect("/404"); 
  });
  

  const hostname = globals.hostname;
  const port = globals.port;

  app.listen(port, hostname, () => {
    console.log("Listening to http://" + hostname + ":" + port);
  });
}();