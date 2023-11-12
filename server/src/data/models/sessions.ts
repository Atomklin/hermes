import { SessionData, Store } from "express-session";
import { Model, ModelStatic, Op, Optional } from "sequelize";

import { handleAsyncFunction } from "../../all-purpose/misc";

export interface SessionAttributes {
  sid: string;
  expires: Date;
  data: string;
}

export type SessionModel = Model<SessionAttributes, Optional<SessionAttributes, "sid">>;
export type StaticSessionModel = ModelStatic<SessionModel>;


export const MAX_AGE = 7.2e6;

export class SessionStorage extends Store {
  private readonly _interval;
  private _clearLock = false;

  constructor(private readonly _sessions: StaticSessionModel) {
    super({ captureRejections: true });
    this._interval = setInterval(
      this._clearExpiredSessions.bind(this),
      MAX_AGE / 2
    );

    this._interval.unref();
  }

  public get(sid: string, callback: (err: any, session?: SessionData) => void) {
    handleAsyncFunction(async() => {
      const session = await this._sessions.findByPk(sid);
      return session != null
        ? JSON.parse(session.getDataValue("data"))
        : undefined;

    }, (result) => callback(undefined, result));
  }

  public set(sid: string, session: SessionData, callback = defaultCallback) {
    handleAsyncFunction(async() => {
      const data = JSON.stringify(session);
      const expires = session.cookie.expires == null 
        ? new Date(Date.now() + MAX_AGE)
        : session.cookie.expires;

      await this._sessions.upsert({
        expires, data, sid
      });
    }, callback);
  }

  public destroy(sid: string, callback = defaultCallback): void {
    handleAsyncFunction(async() => {
      await this._sessions.destroy({ where: { sid }});
    }, callback);
  }
  
  public all(callback: (err: any, obj?: SessionData[] | Record<string, SessionData>) => void) {
    handleAsyncFunction(async () => {
      const sessions = await this._sessions.findAll();
      return sessions.map((session) => 
        JSON.parse(session.getDataValue("data")));
    }, (result) => callback(undefined, result));
  }

  public length(callback: (err: any, length?: number) => void) {
    handleAsyncFunction(this._sessions.count.bind(this._sessions), 
      (length) => callback(undefined, length));
  }

  public clear(callback = defaultCallback) {
    handleAsyncFunction(async() => {
      await this._sessions.destroy();
    }, callback);
  }

  public touch(sid: string, session: SessionData, callback = defaultCallback) {
    handleAsyncFunction(async() => {
      const expires = session.cookie.expires == null
        ? new Date(Date.now() + MAX_AGE)
        : session.cookie.expires;

      await this._sessions.update({ expires }, { where: { sid }});
    }, callback);
  }

  private _clearExpiredSessions() {
    if (this._clearLock)
      return;

    handleAsyncFunction(async() => {
      this._clearLock = true;
      await this._sessions.destroy({
        where: { expires: { [Op.lt]: new Date() }}
      });

    }, () => { 
      this._clearLock = false; 
    });
  }
}

function defaultCallback() {}