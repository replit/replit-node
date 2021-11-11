import { json as expressJSON, Router } from "express";
import { IDatabaseClient, Middleware } from "../types";
import { KeyError } from "./rawclient";

// Handles async errors by passing them to the error handler middleware.
// Without this, the request will simply hang indefinitely on error.
// express 5.0 does this out of the box but we want to support old versions
function wrapAsync(func: Middleware): Middleware {
  return async (req, res, next) => {
    try {
      return await func(req, res, next);
    } catch (e) {
      return next(e);
    }
  };
}

export function exposeRead(db: IDatabaseClient, ...keys: string[]): Middleware {
  const router = Router();
  const allowed = new Set(keys);
  router.get(
    "/:key",
    wrapAsync(async (req, res, next) => {
      const { key } = req.params;
      if (!allowed.has(key)) return next();

      let value;
      try {
        value = await db.get(key);
      } catch (e) {
        if (e instanceof KeyError) {
          return res.status(404).json({ error: "Key not found" });
        }
        throw e;
      }

      return res.json({ value });
    })
  );
  return router;
}

export function exposeWrite(
  db: IDatabaseClient,
  ...keys: string[]
): Middleware {
  const router = Router();
  const allowed = new Set(keys);
  router.post(
    "/:key",
    expressJSON(),
    wrapAsync(async (req, res, next) => {
      const { key } = req.params;
      if (!allowed.has(key)) return next();

      const val = req.body.value;
      if (typeof val !== "string") {
        return res.status(400).json({ error: "Missing value in request body" });
      }

      await db.setMany(new Map([[key, val]]));
      return res.json({ ok: true });
    })
  );
  return router;
}

export function exposeReadWrite(
  db: IDatabaseClient,
  keys: Set<string>
): Middleware {
  const router = Router();
  router.use(exposeRead(db, keys));
  router.use(exposeWrite(db, keys));
  return router;
}
