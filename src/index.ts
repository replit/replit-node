import { Client } from "./db/client";
import { RawClient } from "./db/rawclient";

export { Client } from "./db/client";
export { RawClient } from "./db/rawclient";
export { exposeRead, exposeReadWrite, exposeWrite } from "./db/server";
export { AUTH_SNIPPET, requireAuth } from "./web";

export const rawDB = new RawClient(process.env.REPLIT_DB_URL || "");
export const db = Client.create(process.env.REPLIT_DB_URL || "");
