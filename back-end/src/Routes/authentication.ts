import { Router } from "express";
import passport from "passport";

import { ensureBasicAuth } from "../All-Purpose/middlewares.js";
import { UserModel } from "../Data/Base/models.js";
import { globals } from "../Data/GlobalData.js";
import { generateSaltAndHash } from "../Data/passport.js";

const router = Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  const status = req.isAuthenticated() ? 200 : 401;
  res.sendStatus(status);
});


router.post("/register", (req, res) => {
  if (req.isUnauthenticated())
    return void res.sendStatus(401);

  if (!req.body.username || !req.body.password)
    return void res.sendStatus(400);

  const [salt, hash] = generateSaltAndHash(req.body.password);
  globals.sequelize.models.users.create({
    username: req.body.username,
    hash, salt
  }).then(() => void res.sendStatus(200));
});


router.post("/logout", (req, res) => {
  if (req.isUnauthenticated())
    return void res.sendStatus(400);

  const language = (req.user as UserModel).getDataValue("language");
  req.logOut((err) => {
    err != null 
      ? res.sendStatus(500)
      : res.redirect("/" + language + "/login");
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
