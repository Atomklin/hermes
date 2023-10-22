import { Router } from "express";
import passport from "passport";

import { globals } from "../Data/GlobalData.js";
import { generateSaltAndHash, UserModel } from "../Data/passport.js";

export const router = Router();

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

export default router;
