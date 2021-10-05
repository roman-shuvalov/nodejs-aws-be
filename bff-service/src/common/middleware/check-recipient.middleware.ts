import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RecipientService } from '../service/recipient.service';

@Injectable()
export class CheckRecipientMiddleware implements NestMiddleware {
  constructor(private readonly recipientService: RecipientService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const recipient = this.recipientService.get();
    if (!this.recipientService.exists(recipient)) {
      return res.status(502).send('Cannot process request');
    }

    next();
  }
}
