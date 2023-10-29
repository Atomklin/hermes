import { Router } from "express";

import { handleJsonPromise } from "../All-Purpose/middlewares";
import { StaticRegimentModel, UserModel } from "../Data/Base/models";
import { globals } from "../Data/GlobalData";

const router = Router();

router.get("/current", (req, res) => 
  void handleJsonPromise(async () => {
    const regimentId = (req.user as UserModel).getDataValue("regimentId");
    if (regimentId)
      return;

    const regiments = globals.sequelize.models.regiments as StaticRegimentModel;
    const regiment = await regiments.findByPk(regimentId);

    if (regiment)
      return {
        name: regiment.getDataValue("name"),
        icon: regiment.getDataValue("icon")
      };
  }, res)
);

// router.post("/create", (req, res) => )

export default router;