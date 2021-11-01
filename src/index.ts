import * as express from "express";
import { AuthMiddleware, RequestAuthContext } from "./types";

function headerProxy(
  req: express.Request,
  obj: Record<string, any>,
  prop: string,
  headerName: string
): void {
  Object.defineProperty(obj, prop, {
    configurable: false,
    enumerable: true,
    get: function () {
      return req.headers[headerName];
    },
  });
}

export const authMiddleware: AuthMiddleware = (req, _res, next) => {
  if (req.headers["x-replit-user-id"]) {
    const authObj = {};
    headerProxy(req, authObj, "id", "x-replit-user-id");
    headerProxy(req, authObj, "name", "x-replit-user-name");
    headerProxy(req, authObj, "roles", "x-replit-user-roles");
    req.auth = authObj as RequestAuthContext;
  }
  return next();
};
