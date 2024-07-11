// eslint-disable-next-line import/no-extraneous-dependencies
const redis = require('redis');
const ServerError = require('../exceptions/ServerError');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });
    this._client.on('error', (error) => {
      console.error(error);
    });
    this._client.connect();
  }

  async set({ key, value, expirationInSecond = 1800 }) {
    try {
      await this._client.set(key, value, {
        EX: expirationInSecond,
      });
    } catch (e) {
      throw new ServerError();
    }
  }

  async get({ key }) {
    const result = await this._client.get(key);
    if (result === null) return null;
    return result;
  }

  delete({ key }) {
    try {
      return this._client.del(key);
    } catch (e) {
      throw new ServerError();
    }
  }
}

module.exports = CacheService;
