import { RawClient } from "./rawclient";

export class Client {
  readonly rawClient: RawClient;
  readonly cache: Map<string, string>;

  constructor(rawClient: RawClient, cache: Map<string, string>) {
    this.rawClient = rawClient;
    this.cache = cache;
  }

  static create(url: string) {
    return new Client(new RawClient(url), new Map());
  }

  emptyCache() {
    this.cache.clear();
  }

  async get(key: string) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const value = await this.rawClient.get(key);
    this.cache.set(key, value);
    return value;
  }

  async setMany(items: Map<string, string>) {
    await this.rawClient.setMany(items);
    for (const [key, value] of items.entries()) {
      this.cache.set(key, value);
    }
  }

  async set(key: string, value: string) {
    await this.setMany(new Map([[key, value]]));
  }

  async list(prefix: string) {
    // caching this would require pulling the entire DB down at startup, and being
    //  forced to create the DB Client in an async context is no fun. Implementing
    //  such a cache is left as an exercise to the reader.
    return this.rawClient.list(prefix);
  }

  async delete(key: string) {
    await this.rawClient.delete(key);
    this.cache.delete(key);
  }
}
