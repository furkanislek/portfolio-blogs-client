import axios from "axios";
import { LRUCache } from "lru-cache";
import { decryptData } from "@/app/api/crypto";

const cache = new LRUCache({
  max: 100,
  ttl: 2000,
});

export const getData = async (endpoint) => {
  const cacheKey = `cache_${endpoint}_1`;

  const localCache = localStorage.getItem(cacheKey);
  if (localCache) {
    const decryptedData = decryptData(localCache);

    return decryptedData;
  }

  if (cache.has(endpoint)) {
    const cacheEntry = cache.get(endpoint);

    if (cacheEntry && Date.now() - cacheEntry.timestamp > 3) {
      cache.delete(endpoint);
      localStorage.removeItem(cacheKey);
    } else {
      return cacheEntry.data;
    }
  }

  try {
    const response = await axios.get(`${process.env.API}/${endpoint}`);

    const cacheData = { data: response.data, timestamp: Date.now() };
    cache.set(endpoint, cacheData);
    localStorage.setItem(cacheKey, JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    throw error;
  }
};
