import * as express from "express";

type RequestAuthContext = { name: string };

declare global {
  declare namespace Express {
    export interface Request {
      auth?: RequestAuthContext;
    }
  }
}

export type Middleware = express.RequestHandler;
