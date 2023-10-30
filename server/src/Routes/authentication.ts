import { Router } from "express";
import passport from "passport";

import { ensureBasicAuth } from "../All-Purpose/middlewares";
import { UserModel } from "../Data/Base/models";

const router = Router();

router.get("/login", passport.authenticate("discord", { 
  scope: ["identify", "guilds"]
}));

router.get("/callback", passport.authenticate("discord"), (req, res) => {
  if (req.isUnauthenticated()) {
    res.status(403);
    res.send("Could not get Discord Authorization, try again later.");

  } else {
    res.redirect("/");
  }
});


router.post("/logout", (req, res) => {
  if (req.isUnauthenticated())
    return void res.sendStatus(400);

  req.logOut((err) => {
    err != null 
      ? res.sendStatus(500)
      : res.redirect("/");
  });
});


router.get("/userinfo", ensureBasicAuth, (req, res) => {
  const model = (req.user as UserModel);
  res.json({
    permissions: model.getDataValue("permissions"),
    language: model.getDataValue("language"),
    username: model.getDataValue("username")
  });
});

export default router;