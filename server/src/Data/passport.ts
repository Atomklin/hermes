import { Application } from "express";
import passport from "passport";
import { Strategy } from "passport-discord";
import { Sequelize } from "sequelize";

import { StaticUserModel, UserRoles } from "./Base/models";

// This entirety was quite difficult to setup, as passport-js 
// lacked any detailed documentation on how and when to use certain methods.

// Helpful Resources:
// https://stackoverflow.com/questions/29066348/passportjs-serializeuser-and-deserializeuser-execution-flow
// https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize 

export function preparePassport(app: Application, sequelize: Sequelize) {
  app.use(passport.initialize());
  app.use(passport.session());

  const model = sequelize.models.users as StaticUserModel;

  const clientID = process.env["DISCORD_CLIENT_ID"];
  const clientSecret = process.env["DISCORD_CLIENT_SECRET"];
  const callbackURL = process.env["DISCORD_CALLBACK_URL"];
  const scope = ["identity", "guilds"];

  if (!clientID || !clientSecret || !callbackURL)
    throw Error("Missing Discord Auth ENV");

  passport.use(new Strategy({ 
    clientSecret,
    callbackURL,
    clientID,
    scope,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }, (_a, _r, profile, done) => {
    model.findOrCreate({
      where: { id: profile.id },
      defaults: { 
        permissions: UserRoles.ReadOnly,
        username: profile.username,
        language: "en",
      }
    }).catch(() => void done(undefined, false))
      .then((user) => void done(undefined, user ? user : false));
  }));

  // user is from the verify function above
  // Convert UserModel into a simpler id that is stored in passport
  passport.serializeUser((user: any, done) => {
    done(undefined, user.getDataValue("id"));
  });

  // Convert the simple id from above to a UserModel which will be stored in `req.user`
  passport.deserializeUser((id: any, done) => {
    model.findByPk(id)
      .catch(() => void done(undefined, false))
      .then((user) => void done(undefined, user));
  });
}