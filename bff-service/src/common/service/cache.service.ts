import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  get(key) {
    return this.cacheManager.get(key);
  }

  set(key, value, ttl = 0) {
    return this.cacheManager.set(key, value, { ttl });
  }
}
