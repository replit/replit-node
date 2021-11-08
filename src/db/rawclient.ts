import { request } from "undici";
import { IDatabaseClient } from "../types";

export class KeyError extends Error {}

/** Raw, low-level API access. */
export class RawClient implements IDatabaseClient {
  /** URL should not have a trailing slash, but it doesn't really matter. */
  readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  async get(key: string): Promise<string> {
    const { statusCode, body } = await request(
      this.url + "/" + encodeURIComponent(key)
    );
    if (statusCode == 404) {
      throw new KeyError("Key not found");
    }
    if (statusCode != 200) {
      throw new Error(
        `Unexpected status code while getting key: ${statusCode}`
      );
    }
    return body.text();
  }

  async setMany(items: Map<string, string>): Promise<void> {
    const requestBodyItems = [];
    for (const [key, val] of items.entries()) {
      requestBodyItems.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(val)
      );
    }
    const { statusCode } = await request(this.url, {
      method: "POST",
      body: requestBodyItems.join("&"),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (statusCode != 200) {
      throw new Error(
        `Unexpected status code while setting keys: ${statusCode}`
      );
    }
  }

  async delete(key: string): Promise<void> {
    const { statusCode } = await request(
      this.url + "/" + encodeURIComponent(key),
      { method: "DELETE" }
    );
    if (statusCode != 204) {
      throw new Error(
        `Unexpected status code while deleting key: ${statusCode}`
      );
    }
  }

  async list(prefix: string): Promise<string[]> {
    const { statusCode, body } = await request(
      this.url + "?encode=true&prefix=" + encodeURIComponent(prefix)
    );
    if (statusCode != 200) {
      throw new Error(
        `Unexpected status code while listing keys: ${statusCode}`
      );
    }
    return (await body.text())
      .split("\n")
      .map((val) => decodeURIComponent(val));
  }
}
