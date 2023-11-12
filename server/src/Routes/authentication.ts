import { Router } from "express";
import passport from "passport";

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

export default router;