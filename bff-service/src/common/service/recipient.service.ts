import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestService } from './request.service';
import { CacheService } from './cache.service';
import { recipientsToCache } from '../enum/recipients-to-cache.enum';

@Injectable()
export class RecipientService {
  constructor(
    private readonly requestService: RequestService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService
  ) {}

  get() {
    return this.requestService.getOriginalUrl().split('/')[1]
  }

  getUrl(recipient: string) {
    return this.configService.get<string>(recipient);
  }

  exists(recipient: string) {
    return !!this.getUrl(recipient);
  }

  shouldSaveCache() {
    return recipientsToCache.has(this.get());
  }

  saveToCache(data) {
    return this.cacheService.set(`recipient:${this.get()}`, data, 120);
  }

  getCache() {
    return this.cacheService.get(`recipient:${this.get()}`);
  }
}
