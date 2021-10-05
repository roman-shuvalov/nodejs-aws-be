import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RecipientService } from '../service/recipient.service';

@Injectable()
export class CacheRecipientMiddleware implements NestMiddleware {
  constructor(private readonly recipientService: RecipientService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const recipient = this.recipientService.get();
    if (!recipient) {
      return next();
    }

    const cache = await this.recipientService.getCache();
    if (cache) {
      return res.send(cache);
    }

    next();
  }
}
