import { config } from "dotenv";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { SequelizeInstance, setupSequelize } from "./models/setup";

export class GlobalData {
  private _sequelize?: SequelizeInstance;

  public readonly port;
  public readonly hostname;
  public readonly isProduction;

  /** Base directory containing both client code and server code */
  public readonly baseDir;
  public readonly clientDir;

  constructor() {
    this.baseDir = join(__dirname, "..", "..", "..");
    this.clientDir = join(this.baseDir, "client", "dist");

    config({ path: join(this.baseDir, ".env") });

    this.port = parseInt(process.env["PORT"]!);
    this.isProduction = process.env["NODE_ENV"] != "development";
    this.hostname = this.isProduction && process.env["HOSTNAME"] != null
      ? process.env["HOSTNAME"]
      : "127.0.0.1";

    if (this.isProduction && 
      process.env["NODE_ENV"] != "production")
      process.env["NODE_ENV"] = "production";

    if (this.port == null || 
        this.hostname == null || 
        typeof process.env["RL_WINDOW_MS"] !== "string" ||
        typeof process.env["SESSION_SECRET"] !== "string" ||
        typeof process.env["RL_MAX_CONNECTIONS"] !== "string" )
      throw Error("Missing server environment variables");

    if (this.isProduction && 
       !existsSync(this.clientDir))
      throw Error("Compiled client code missing");
  }


  public get sequelize() {
    if (this._sequelize == null)
      throw Error("Database has not been initialized yet");
    return this._sequelize;
  }

  public async loadDatabase() {
    const dbUsername = process.env["DB_USERNAME"];
    const dbPassword = process.env["DB_PASSWORD"];
    const dbHostname = process.env["DB_HOSTNAME"];
    const dbName = process.env["DB_NAME"];

    if (!dbName || !dbUsername || !dbPassword)
      throw Error("Missing Database ENV");

    this._sequelize = await setupSequelize(
      dbName, dbUsername, dbPassword, dbHostname);
  }
}

export const globals = new GlobalData();