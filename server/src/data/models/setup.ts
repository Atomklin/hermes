import { Application } from "express";
import passport from "passport";
import Strategy from "passport-discord";
import { DataTypes, Sequelize } from "sequelize";

import { StaticRegionModel, StaticTownModel } from "./locations";
import { StaticSessionModel } from "./sessions";
import {
  findOrCreateUser, StaticMembershipModel, StaticRegimentModel, StaticUserModel
} from "./users";

export async function setupSequelize(
  name: string,
  username: string,
  password: string,
  host = "localhost"
) {
  const sequelize = new Sequelize(name, username, password, {
    dialectOptions: { host },
    dialect: "mariadb",
  }) as SequelizeInstance;

  ///////////////////////////////////////////////////////////////////////////////////////
  // Users
  ///////////////////////////////////////////////////////////////////////////////////////

  sequelize.define("regiments", {
    id: {
      type: DataTypes.STRING(24),
      primaryKey: true
    },
    name: DataTypes.STRING(127),
    icon: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  sequelize.define("users", {
    id: {
      type: DataTypes.STRING(24),
      primaryKey: true
    },
    username: DataTypes.STRING(32),
    icon: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(2),
      defaultValue: "en"
    }
  });

  sequelize.define("memberships", {
    permission: DataTypes.TINYINT.UNSIGNED,
    verification: DataTypes.DATE
  });

  sequelize.models.regiments.belongsToMany(sequelize.models.users, { through: "memberships" });
  sequelize.models.users.belongsToMany(sequelize.models.regiments, { through: "memberships" });


  ///////////////////////////////////////////////////////////////////////////////////////
  // Auth
  ///////////////////////////////////////////////////////////////////////////////////////

  sequelize.define("sessions", {
    sid: { 
      type: DataTypes.STRING(32),
      primaryKey: true
    },
    expires: DataTypes.DATE,
    data: DataTypes.TEXT // Json
  });


  ///////////////////////////////////////////////////////////////////////////////////////
  // Locations
  ///////////////////////////////////////////////////////////////////////////////////////

  sequelize.define("regions", {
    name: DataTypes.STRING(32),
    code: {
      type: DataTypes.STRING(2),
      allowNull: true,
    }
  });

  sequelize.define("towns", {
    name: DataTypes.STRING(32),
    code: {
      type: DataTypes.STRING(3),
      allowNull: true
    }
  });

  sequelize.models.towns.belongsTo(sequelize.models.regions);
  sequelize.models.regions.hasMany(sequelize.models.towns);


  ///////////////////////////////////////////////////////////////////////////////////////
  // Stockpiles
  ///////////////////////////////////////////////////////////////////////////////////////

  sequelize.define("items", {
    code: DataTypes.STRING(32),
    name: DataTypes.STRING(32)
  });

  sequelize.define("stockpiles", {
    name: DataTypes.STRING(32),
  }, { paranoid: true });

  sequelize.define("itemCounts", {
    count: DataTypes.INTEGER.UNSIGNED
  }, { paranoid: true });

  sequelize.models.stockpiles.belongsTo(sequelize.models.towns);
  sequelize.models.towns.hasMany(sequelize.models.stockpiles);

  sequelize.models.stockpiles.belongsTo(sequelize.models.regiments);
  sequelize.models.regiments.hasMany(sequelize.models.stockpiles);

  sequelize.models.items.belongsToMany(sequelize.models.stockpiles, { through: "itemCounts" });
  sequelize.models.stockpiles.belongsToMany(sequelize.models.items, { through: "itemCounts" });
  

  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  return sequelize;
}


export function setupPassport(app: Application, sequelize: SequelizeInstance) {
  app.use(passport.initialize());
  app.use(passport.session());

  const model = sequelize.models.users;

  const clientSecret = process.env["DISCORD_CLIENT_SECRET"];
  const callbackURL = process.env["DISCORD_CALLBACK_URL"];
  const clientID = process.env["DISCORD_CLIENT_ID"];
  const scope = ["identify", "guilds"];

  if (!clientID || !clientSecret || !callbackURL)
    throw Error("Missing Discord Auth ENV");

  passport.use(new Strategy({ 
    clientSecret,
    callbackURL,
    clientID,
    scope
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }, (_a, _r, profile, done) => {
    findOrCreateUser(profile, sequelize)
      .catch(() => void done(undefined, undefined))
      .then((result) => void done(undefined, result));
  }));
  
  // user is from the verify function above
  // Convert UserModel into a simpler id that is stored in passport
  passport.serializeUser((users: any, done) => {
    done(undefined, users.getDataValue("id"));
  });
  
  // Convert the simple id from above to a UserModel which will be stored in `req.user`
  passport.deserializeUser((id: any, done) => {
    model.findByPk(id)
      .catch(() => void done(undefined, undefined))
      .then((user) => void done(undefined, user));
  });
}


export type SequelizeInstance = Sequelize & { 
  models: {
    regiments: StaticRegimentModel;
    memberships: StaticMembershipModel;
    users: StaticUserModel;
    sessions: StaticSessionModel;
    regions: StaticRegionModel;
    towns: StaticTownModel;
  }
}