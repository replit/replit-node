import { Middleware, RequestAuthContext } from "./types";
import { headerProxy } from "./util";

export const authMiddleware: Middleware = (req, _res, next) => {
  if (req.headers["x-replit-user-id"]) {
    const authObj = {};
    headerProxy(req, authObj, "id", "x-replit-user-id");
    headerProxy(req, authObj, "name", "x-replit-user-name");
    headerProxy(req, authObj, "roles", "x-replit-user-roles");
    req.auth = authObj as RequestAuthContext;
  }
  return next();
};

export const AUTH_SNIPPET =
  "<script " +
  'authed="location.reload()" ' +
  'src="https://auth.turbio.repl.co/script.js"></script>';

export function requireAuth(loginRes: string = AUTH_SNIPPET): Middleware {
  return (req, res, next) => {
    if (req.auth) return next();
    res.send(loginRes);
  };
}
