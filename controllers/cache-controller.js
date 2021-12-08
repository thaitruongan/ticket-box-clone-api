const NodeCache = require("node-cache");

class CacheController {
  constructor(ttlSeconds = 60) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: 30,
      useClone: false,
    });
  }

  get(key, storeFunction, model = null) {
    const value = this.cache.get(key);
    if (value) {
      console.log(`Retrieving ${key} from cache`);
      return Promise.resolve(value);
    }
    if (model === null)
      return storeFunction().then((result) => {
        this.cache.set(key, result);
        return result;
      });

    return model.storeFunction().then((result) => {
      this.cache.set(key, result);
      return result;
    });
  }

  set(key, value) {
    console.log(key, value);
    this.cache.set(key, value);
  }

  request(key) {
    const value = this.cache.get(key);
    console.log("request: ", key, value);
    if (value) {
      console.log(`Retrieving ${key} from cache`);
      return Promise.resolve(value);
    }

    return Promise.resolve(null);
  }

  delete(keys) {
    this.cache.del(keys);
  }

  flush() {
    this.cache.flushAll();
  }
}

const cache = new CacheController(604800);
module.exports = { cache, CacheController };
