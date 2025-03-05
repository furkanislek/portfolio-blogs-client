import axios from "axios";
import { LRUCache } from "lru-cache";

const cache = new LRUCache({
  max: 100,
  ttl: 10000000, 
});

export const getData = async (endpoint) => {
  const cacheKey = `cache_${endpoint}`;

  const localCache = localStorage.getItem(cacheKey);
  if (localCache) {
    return JSON.parse(localCache);
  }

  if (cache.has(endpoint)) {
    return cache.get(endpoint);
  }

  try {
    const response = await axios.get(`${process.env.API}/${endpoint}`);
    cache.set(endpoint, response.data);
    localStorage.setItem(cacheKey, JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw error;
  }
};
