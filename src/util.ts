import * as express from "express";

export function headerProxy(
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
