import { DataTypes, Sequelize } from "sequelize";

import { UserRoles } from "./Base/models.js";

export async function prepareSequelize(name: string, username: string, password: string, host = "localhost") {
  const sequelize = new Sequelize(name, username, password, {
    dialectOptions: { host },
    dialect: "mysql"
  });

  // All models are stored in sequelize.models["modelName"];

  ///////////////////////////////////////////////////////////////////////////////////////
  // Users
  ///////////////////////////////////////////////////////////////////////////////////////

  sequelize.define("regiments", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    icon: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(127),
      unique: true
    },
    hash: DataTypes.TEXT,
    salt: DataTypes.TEXT,
    regimentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "regiments",
        key: "id"
      }
    },
    permissions: {
      type: DataTypes.TINYINT({ unsigned: true }),
      defaultValue: UserRoles.ReadOnly
    },
    language: {
      type: DataTypes.STRING(2),
      defaultValue: "en"
    }
  });

  sequelize.define("sessions", {
    sid: { 
      type: DataTypes.STRING(32),
      primaryKey: true
    },
    expires: DataTypes.DATE,
    data: DataTypes.TEXT
  });

  ///////////////////////////////////////////////////////////////////////////////////////
  // Locations
  ///////////////////////////////////////////////////////////////////////////////////////

  sequelize.define("regions", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(32),
    code: {
      type: DataTypes.STRING(2),
      allowNull: true,
    }
  });

  sequelize.define("towns", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(32),
    regionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "regions",
        key: "id"
      }
    },
    code: {
      type: DataTypes.STRING(3),
      allowNull: true
    }
  });

  ///////////////////////////////////////////////////////////////////////////////////////
  // Stockpiles
  ///////////////////////////////////////////////////////////////////////////////////////

  sequelize.define("items", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: DataTypes.STRING(32),
    name: DataTypes.STRING(32)
  });

  sequelize.define("stockpiles", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(32),
    regimentId: {
      type: DataTypes.INTEGER,
      references: {
        model: "regiments",
        key: "id"
      }
    },
    townId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "towns",
        key: "id"
      }
    }
  });

  sequelize.define("itemCounts", {
    itemId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "items",
        key: "id"
      }
    },
    stockpileId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "stockpiles",
        key: "id"
      }
    },
    count: DataTypes.INTEGER
  });
  
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  return sequelize;
}