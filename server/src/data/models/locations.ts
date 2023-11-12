import { Model, ModelStatic, Optional } from "sequelize";

export interface RegionAttributes {
  id: number;
  name: string;
  code?: string;
}

export interface TownAttributes {
  id: number;
  regionId: number;
  name: string;
  code?: string;
}


export type StaticRegionModel = ModelStatic<RegionModel>;
export type RegionModel = Model<RegionAttributes, Optional<RegionAttributes, "id">> & {
  getTowns(): Promise<TownModel[]>;
};

export type StaticTownModel = ModelStatic<TownModel>;
export type TownModel = Model<TownAttributes, Optional<TownAttributes, "id" | "regionId">> & {
  getRegion(): Promise<RegionModel>;
};


// export function loadLocationData(sequelize: SequelizeInstance) {
//   //
// }