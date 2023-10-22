import { DataTypes, Sequelize } from "sequelize";

export async function prepareSequelize(name: string, username: string, password: string, host = "localhost") {
  const sequelize = new Sequelize(name, username, password, {
    dialectOptions: { host },
    dialect: "mysql"
  });

  sequelize.define("sessions", {
    sid: { 
      type: DataTypes.STRING(50),
      primaryKey: true
    },
    expires: DataTypes.DATE,
    data: DataTypes.TEXT
  });

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
    regiment: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "regiments",
        key: "id"
      }
    },
    language: {
      type: DataTypes.STRING(2),
      defaultValue: "en"
    }
  });
  
  await sequelize.authenticate();
  await sequelize.sync();

  return sequelize;
}