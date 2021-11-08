import { Router } from "express";
import { IDatabaseClient, Middleware } from "../types";

export function exposeRead(db: IDatabaseClient, keys: Set<string>): Middleware {
  const router = Router();
  router.get("/:key", async (req, res, next) => {
    const { key } = req.params;
    if (!keys.has(key)) return next();
    const value = await db.get(key);
    res.json({ value });
  });
  return router;
}

export function exposeWrite(
  db: IDatabaseClient,
  keys: Set<string>
): Middleware {
  const router = Router();
  router.post("/:key", async (req, res, next) => {
    const { key } = req.params;
    if (!keys.has(key)) return next();
    const val = req.body.value;
    if (typeof val !== "string") {
      return res.status(400).json({ error: "Missing value in request body" });
    }
    await db.setMany(new Map([[key, val]]));
    return res.json({ ok: true });
  });
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
