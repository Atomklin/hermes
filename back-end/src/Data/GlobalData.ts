import { config } from "dotenv";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Sequelize } from "sequelize";

export class GlobalData {
  private _sequelize?: Sequelize;

  public readonly isProduction;
  public readonly hostname;
  public readonly port;

  /** Base directory containing both front-end code and back-end code */
  public readonly baseDir;
  /** Dir of the compiled front-end code */
  public readonly frontEndDir;

  constructor() {
    this.baseDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
    this.frontEndDir = join(this.baseDir, "front-end", "dist");

    config({ path: join(this.baseDir, ".env") });

    this.isProduction = process.env["NODE_ENV"] != "development";
    this.port = parseInt(process.env["PORT"]!);
    this.hostname = this.isProduction && process.env["HOSTNAME"] != null 
      ? process.env["HOSTNAME"] 
      : "127.0.0.1";      

    if (this.port == null || this.hostname == null)
      throw Error("Missing server environment variables");

    if (this.isProduction && !existsSync(this.frontEndDir))
      throw Error("Compiled front-end code missing");
  }

  public async loadDatabase() {
    const username = process.env["DB_USERNAME"];
    const password = process.env["DB_PASSWORD"];
    const host = process.env["DB_HOSTNAME"];
    const name = process.env["DB_NAME"];

    if (!name || !username || !password)
      throw Error("Missing database environment variables");

    const sequelize = new Sequelize(name, username, password, {
      dialectOptions: { host },
      dialect: "mysql"
    });

    await sequelize.authenticate();
    this._sequelize = sequelize;
  }
}

export const globals = new GlobalData();