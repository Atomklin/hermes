import { Router } from "express";

import { handleAsyncFunction } from "../all-purpose/misc";
import { UserModel } from "../data/models/users";

const AVAILABLE_LANGUAGES = ["en"];
const router = Router();

router.get("/me", (req, res) => {
  const user = req.user as UserModel;
  res.json({
    language: user.getDataValue("language"),
    username: user.getDataValue("username"),
    icon: user.getDataValue("icon"),
    id: user.getDataValue("id")
  });
});


router.patch("/me", (req, res) => {
  if (typeof req.query.language !== "string" ||
      !AVAILABLE_LANGUAGES.includes(req.query.language))
    return void res.sendStatus(400);
    
  const user = req.user as UserModel;
  handleAsyncFunction(async() => {
    await user.update("language", req.query.language as string);
  }, 
  () => void res.sendStatus(200),
  () => void res.sendStatus(400));
});

export default router;