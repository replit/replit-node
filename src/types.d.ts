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

export interface IDatabaseClient {
  get(key: string): Promise<string>;
  setMany(items: Map<string, string>): Promise<void>;
  list(prefix: string): Promise<string[]>;
  delete(key: string): Promise<void>;
}
