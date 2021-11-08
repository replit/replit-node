import { RawClient } from "./db/rawclient";

export const rawDB = new RawClient(process.env.REPLIT_DB_URL || "");
export { AUTH_SNIPPET, requireAuth } from "./web";
