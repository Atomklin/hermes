import { NextFunction, Request, Response } from "express";

import { handleAsyncFunction } from "./misc";

export function ensureBasicAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isUnauthenticated()) {
    res.sendStatus(403);
  } else {
    next();
  }
}

export function handleJsonPromise<T>(func: () => Promise<T>, res: Response) {
  handleAsyncFunction<T>(func, 
    (result) => void res.json(result),
    () => void res.sendStatus(500)
  );
}