import Strategy from "passport-discord";
import { Model, ModelStatic, Optional } from "sequelize";

import { SequelizeInstance } from "./setup";
import { StockpileModel } from "./stockpiles";

// 8 Bits of Permission (Unsigned)
// 0000 0001 Read
// 0000 0010 Scan / Add Stockpile Data
// 0000 0100 Edit Stockpile Data
// 0000 1000 Delete / Modify Stockpile
// 
// 0001 0000 View Audit Log
// 0010 0000 Manage User Permissions
// 0100 0000 Mange Regiment
// 1000 0000 Ban Regiments

export enum PermissionBit {
  StockpileRead       = 0b00000001,
  StockpileScan       = 0b00000010,
  StockpileEdit       = 0b00000100,
  StockpileDelete     = 0b00001000,
  ViewAuditLog        = 0b00010000,
  EditUserPermissions = 0b00100000,
  EditRegiment        = 0b01000000,
  BanRegiments        = 0b10000000
}

export enum UserRoles {
  Unverified     = 0b00000000,
  ReadOnly       = 0b00000001,
  Member         = 0b00000111,
  Logistics      = 0b00001111,
  Admin          = 0b00111111,
  HighCommand    = 0b01111111,
  ServerOperator = 0b11111111
}


export interface RegimentAttributes {
  id: string;
  name: string;
  icon?: string;
}

export interface MembershipAttributes {
  userId: number;
  regimentId: number;
  permission: number;
}

export interface UserAttributes {
  id: string;
  username: string;
  language: string;
  icon?: string;
}


export type StaticRegimentModel = ModelStatic<RegimentModel>;
export type RegimentModel = Model<RegimentAttributes, Optional<RegimentAttributes, "id">> & {
  getUsers(): Promise<(UserModel & { memberships: MembershipModel })[]>;
  getStockpiles(): Promise<StockpileModel[]>;
};

export type MembershipModel = Model<MembershipAttributes, Optional<MembershipAttributes, "regimentId" | "userId">>;
export type StaticMembershipModel = ModelStatic<MembershipModel>;

export type StaticUserModel = ModelStatic<UserModel>;
export type UserModel = Model<UserAttributes, Optional<UserAttributes, "id">> & {
  getRegiments(): Promise<(RegimentModel & { memberships: MembershipModel })[]>;
  hasRegiment(regiment: RegimentModel): Promise<boolean>;
  addRegiment(regiment: RegimentModel): Promise<void>;
};


export async function findOrCreateUser(profile: Strategy.Profile, sequelize: SequelizeInstance) {
  const regiments = sequelize.models.regiments;
  const users = sequelize.models.users;

  const [user] = await users.findOrCreate({
    where: { id: profile.id },
    defaults: {
      username: profile.username, 
      icon: profile.avatar!,
      language: "en"
    }
  });

  console.log(profile);

  if (profile.guilds) {
    for (const guild of profile.guilds) {
      const regiment = await regiments.findByPk(guild.id);

      if (regiment != null) {
        const hasRegiment = await user.hasRegiment(regiment);
        !hasRegiment && user.addRegiment(regiment);
      }
    }
  }

  return user;
}


export function hasPermission(permissions: number, bits: PermissionBit) {
  return (permissions & bits) === bits;
}