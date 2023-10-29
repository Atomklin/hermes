import { Model, ModelStatic, Optional } from "sequelize";

///////////////////////////////////////////////////////////////////////////////////////
// Users
///////////////////////////////////////////////////////////////////////////////////////

export interface RegimentAttributes {
  id: number;
  name: string;
  icon?: string;
}

export type RegimentModel = Model<RegimentAttributes, Optional<RegimentAttributes, "id">>;
export type StaticRegimentModel = ModelStatic<RegimentModel>;


/**
 * 8 Bits of Permission (Unsigned)
 * Regiment Only
 * 0000 0000 Nothing
 * 0000 0001 Read
 * 0000 0010 Write / Edit
 * 0000 0100 Edit permissions
 * 0000 1000 Create users
 * 
 * Coalition
 * 0001 0000 See coalition stockpile
 * 0010 0000 Write / Edit coalition stockpile
 * 0100 0000 Edit other coalition members perms' in stockpile
 * 1000 0000 Create and edit all users perms
 */
export enum UserRoles {
  ReadOnly = 1,
  RegimentMember = 3,
  RegimentModerator = 7,
  RegimentOfficer = 15,

  CoalitionMember = 63,
  CoalitionOfficer = 127,
  CoalitionHighCommand = 255, // More or less server operator
}

export interface UserAttributes {
  id: number;
  username: string;
  regimentId?: number;
  permissions: number;
  language: string;
}

export type UserModel = Model<UserAttributes, Optional<UserAttributes, "id">>;
export type StaticUserModel = ModelStatic<UserModel>;


export interface SessionAttributes {
  sid: string;
  expires: Date,
  data: string
}

export type SessionModel = Model<SessionAttributes, Optional<SessionAttributes, "sid">>;
export type StaticSessionModel = ModelStatic<SessionModel>;

///////////////////////////////////////////////////////////////////////////////////////
// Locations
///////////////////////////////////////////////////////////////////////////////////////

export interface RegionAttributes {
  id: number;
  name: string;
  code?: string;
}

export type RegionModel = Model<RegionAttributes, Optional<RegimentAttributes, "id">>;
export type StaticRegionModel = ModelStatic<RegionModel>;


export interface TownAttributes {
  id: number;
  name: string;
  regionId?: number;
  code?: string;
}

export type TownModel = Model<TownAttributes, Optional<TownAttributes, "id">>;
export type StaticTownModel = ModelStatic<TownModel>;

///////////////////////////////////////////////////////////////////////////////////////
// Stockpiles
///////////////////////////////////////////////////////////////////////////////////////

export interface ItemAttributes {
  id: number;
  code: string;
  name: string;
}

export type ItemModel = Model<ItemAttributes, Optional<ItemAttributes, "id">>;
export type StaticItemModel = ModelStatic<ItemModel>;


export interface StockpileAttributes {
  id: number;
  name: string;
  regimentId: number;
  townId?: number;
}

export type StockpileModel = Model<SessionAttributes, Optional<StockpileAttributes, "id">>
export type StaticStockpileModel = ModelStatic<StockpileModel>;


export interface ItemCountAttributes {
  itemId: number;
  stockpileId: number;
  count: number;
}

export type ItemCountModel = Model<ItemCountAttributes, Optional<ItemCountAttributes, "itemId" | "stockpileId">>
export type StaticItemCountModel = ModelStatic<ItemCountModel>;