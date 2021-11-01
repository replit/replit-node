import { AuthMiddleware, RequestAuthContext } from "./types";
import { headerProxy } from "./util";

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
