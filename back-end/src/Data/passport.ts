import { Application } from "express";
import { pbkdf2Sync, randomBytes } from "node:crypto";
import passport from "passport";
import { Strategy } from "passport-local";
import { Model, ModelStatic, Sequelize } from "sequelize";

// This entirety was quite difficult to setup, as passport-js 
// lacked any detailed documentation on how and when to use certain methods.

// Helpful Resources:
// https://stackoverflow.com/questions/29066348/passportjs-serializeuser-and-deserializeuser-execution-flow
// https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize 

export function preparePassport(app: Application, sequelize: Sequelize) {
  app.use(passport.initialize());
  app.use(passport.session());

  const model = sequelize.models.users as StaticUserModel;
  passport.use(new Strategy((username, password, done) => {
    console.log(username, password);
    model.findOne({ where: { username }})
      .catch(() => void done(undefined, false))
      .then((user) => {
        if (!user) {
          done(undefined, false);

        } else {
          const salt = user.getDataValue("salt");
          const hash = user.getDataValue("hash");

          if (isPasswordValid(password, hash, salt)) {
            done(undefined, user);

          } else {
            done (undefined, false);
          }
        }
      });
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


export function isPasswordValid(password: string, hash: string, salt: string) {
  const hashVerify = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return hash === hashVerify;
}

export function generateSaltAndHash(password: string) {
  const salt = randomBytes(32).toString("hex");
  const hash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return [salt, hash] as const;
}



export interface UserAttributes {
  id: number;
  username: string;
  hash: string;
  salt: string;
  language: string;
}

export type UserModel = Model<UserAttributes>;
export type StaticUserModel = ModelStatic<UserModel>;