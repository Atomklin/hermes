import { SessionData, Store } from "express-session";
import { Op, Sequelize } from "sequelize";

import { StaticSessionModel } from "../Base/models.js";

/** 2 Hours */
export const MAX_AGE = 7.2e6;

// My very basic implementation of a Sequelize session storage
export class SessionStorage extends Store {
  private readonly _model: StaticSessionModel;
  private readonly _interval: NodeJS.Timeout;

  constructor(sequelize: Sequelize) {
    super({ captureRejections: true });
    this._model = sequelize.models.sessions;
    
    this._interval = setInterval(
      this._removeExpiredSessions.bind(this),
      MAX_AGE / 2
    );

    this._interval.unref();
  }

  public get(sid: string, callback: (err: any, session?: SessionData) => void) {
    handleAsyncFunc(async() => {
      const session = await this._model.findOne({ where: { sid }});
      if (session)
        return JSON.parse(session.getDataValue("data"));
    }, callback);
  }

  public set(sid: string, session: SessionData, callback = defaultCallback) {
    handleAsyncFunc(async () => {
      const data = JSON.stringify(session);
      const expires = session.cookie.expires == null
        ? new Date(Date.now() + MAX_AGE)
        : session.cookie.expires;

      const [result] = await this._model.findOrCreate({
        defaults: { data, expires },
        where: { sid }
      });

      if (result.getDataValue("data") != data) {
        result.setDataValue("data", data);
        result.setDataValue("expires", expires);
        await result.save();
      }
    }, callback);
  }

  public destroy(sid: string, callback = defaultCallback) {
    handleAsyncFunc(async () => {
      await this._model.destroy({ where: { sid }});
    }, callback);
  }

  public all(callback: (err: any, obj?: SessionData[] | Record<string, SessionData>) => void) {
    handleAsyncFunc(async () => {
      const sessions = await this._model.findAll();
      return sessions.map((session) => 
        JSON.parse(session.getDataValue("data")));
    }, callback);
  }

  public length(callback: (err: any, length?: number) => void){
    handleAsyncFunc(this._model.count.bind(this._model), callback);
  }

  public clear(callback = defaultCallback) {
    handleAsyncFunc(async () => {
      await this._model.destroy();
    }, callback);
  }

  public touch(sid: string, session: SessionData, callback = defaultCallback): void {
    handleAsyncFunc(async () => {
      const expires = session.cookie.expires == null
        ? new Date(Date.now() + MAX_AGE)
        : session.cookie.expires;

      await this._model.update({ expires}, { where: { sid }});
    }, callback);
  }


  private _removeExpiredSessions(callback = defaultCallback) {
    handleAsyncFunc(async () => {
      await this._model.destroy({
        where: { expires: {  [Op.lt]: new Date() }}
      });
    }, callback);
  }
}

function defaultCallback(err: any) {
  err && console.error(err);
}

function handleAsyncFunc<T>(
  asyncFunction: () => Promise<T>, 
  callback: (err: any, result?: T) => void
) {
  asyncFunction()
    .then((result) => callback(undefined, result))
    .catch(() => callback(undefined, undefined));
}

