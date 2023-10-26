import { config } from "dotenv";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Sequelize } from "sequelize";

import { UserRoles } from "./Base/models.js";
import { generateSaltAndHash } from "./passport.js";
import { prepareSequelize } from "./sequelize.js";

export class GlobalData {
  private _sequelize?: Sequelize;

  public readonly port;
  public readonly hostname;
  public readonly isProduction;

  /** Base directory containing both front-end code and back-end code */
  public readonly baseDir;
  /** Dir of the compiled front-end code */
  public readonly frontEndDir;

  constructor() {
    this.baseDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
    this.frontEndDir = join(this.baseDir, "front-end", "dist");

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
       !existsSync(this.frontEndDir))
      throw Error("Compiled front-end code missing");
  }

  public get sequelize() {
    if (this._sequelize == null)
      throw Error("Database not initialized yet");
    return this._sequelize;
  }

  public async loadDatabase() {
    const dbUsername = process.env["DB_USERNAME"];
    const dbPassword = process.env["DB_PASSWORD"];
    const dbHostname = process.env["DB_HOSTNAME"];
    const dbName = process.env["DB_NAME"];

    if (!dbName || !dbUsername || !dbPassword)
      throw Error("Missing database environment variables");

    this._sequelize = await prepareSequelize(
      dbName, dbUsername, dbPassword, dbHostname);

    const adminUsername = process.env["ADMIN_USERNAME"];
    const adminPassword = process.env["ADMIN_PASSWORD"];

    if (!adminUsername || !adminPassword)
      throw Error("Missing admin account environment variables");

    const [salt, hash] = generateSaltAndHash(adminPassword);
    await this._sequelize.models.users.upsert({
      permissions: UserRoles.CoalitionHighCommand,
      username: adminUsername,
      hash, salt,
      id: 1
    });
  }
}

export const globals = new GlobalData();