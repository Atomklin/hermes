import { NextFunction, Request, Response, Router } from "express";

import { handleJsonPromise } from "../all-purpose/middlewares";
import { handleAsyncFunction } from "../all-purpose/misc";
import { globals } from "../data/GlobalData";
import { hasPermission, PermissionBit, RegimentAttributes, UserModel } from "../data/models/users";

const router = Router();

router.get("/all", (req, res) => 
  void handleJsonPromise<(RegimentAttributes & { permission: number })[]>(
    async() => {
      const user = req.user as UserModel;
      const regiments = await user.getRegiments();

      return regiments.map((regiment) => ({
        permission: regiment.memberships.getDataValue("permission"),
        name: regiment.getDataValue("name"),
        icon: regiment.getDataValue("icon"),
        id: regiment.getDataValue("id")
      }));
    }, res));


router.get("/:regimentId/stockpiles", 
  ensureMemberPerms(PermissionBit.StockpileRead), 
  (req, res) => 
    void handleJsonPromise<{ name: string, id: number }[]>(async() => {
      const regiment = await getRegiment(req.params.regimentId);
      const stockpiles = await regiment!.getStockpiles();
    
      return stockpiles.map((stockpile) => ({
        name: stockpile.getDataValue("name"),
        id: stockpile.getDataValue("id")
      }));
    }, res));


function ensureMemberPerms(requirement: PermissionBit[] | PermissionBit) {
  const requiredBits = Array.isArray(requirement) 
    ? requirement.reduce((prev, curr) => prev + curr, 0)
    : requirement;

  return (req: Request, res: Response, next: NextFunction) => 
    void handleAsyncFunction(async() => {
      if (req.params.regimentId)
        throw Error("Missing Params");

      const user = req.user as UserModel;
      const memberships = globals.sequelize.models.memberships;
      const membership = await memberships.findOne({ where: {
        regimentId: req.params.regimentId,
        userId: user.getDataValue("id")
      }});

      if (!membership)
        throw Error("Membership not found");

      const permissions = membership.getDataValue("permission");
      if (!hasPermission(permissions, requiredBits))
        throw Error("Invalid user permissions");
    }, 
    () => next(), 
    () => res.sendStatus(400));
}


function getRegiment(id: string) {
  return globals.sequelize.models.regiments.findByPk(id);
}

export default router;