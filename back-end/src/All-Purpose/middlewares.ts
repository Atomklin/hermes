import { NextFunction, Request, Response } from "express";

export function ensureBasicAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isUnauthenticated()) {
    res.sendStatus(403);
  } else {
    next();
  }
}

export function handleJsonPromise<T>(func: () => Promise<T>, res: Response) {
  func()
    .then((result) => void res.json(result))
    .catch(() => void res.sendStatus(500));
}