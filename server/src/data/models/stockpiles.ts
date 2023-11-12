import { Model, ModelStatic, Optional } from "sequelize";

import { TownModel } from "./locations";
import { RegimentModel } from "./users";

export interface ItemAttributes {
  id: number;
  code: string;
  name: string;
}

export interface StockpileAttributes {
  id: number;
  name: string;
  regimentId: number;
  townId: number;
}

export interface ItemCountAttributes {
  stockpileId: number;
  itemId: number;
  count: number;
}


export type StaticItemModel = ModelStatic<ItemModel>;
export type ItemModel = Model<ItemAttributes, Optional<ItemAttributes, "id">> & {
  getStockpiles(): Promise<StockpileModel[]>;
};

export type ItemCountModel = Model<ItemCountAttributes, Optional<ItemCountAttributes, "itemId" | "stockpileId">>;
export type StaticItemCountModel = ModelStatic<ItemCountModel>;

export type StaticStockpileModel = ModelStatic<StockpileModel>;
export type StockpileModel = Model<StockpileAttributes, Optional<StockpileAttributes, "id">> & {
  getRegiment(): Promise<RegimentModel>;
  getItems(): Promise<(ItemModel & { itemCount: ItemCountModel })[]>;
  getTown(): Promise<TownModel>;
}