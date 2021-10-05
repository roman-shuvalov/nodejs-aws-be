import { Controller, All, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { RecipientService } from './common/service/recipient.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly recipientService: RecipientService,
  ) {}

  @All('*')
  async bff(@Res() response: Response) {
    try {
      const config = this.appService.createRequestConfig();
      const recipientRes = await this.appService.forwardRequest(config);
      response
        .set(recipientRes.headers)
        .status(recipientRes.status)
        .send(recipientRes.data);

      if (this.recipientService.shouldSaveCache()) {
        await this.recipientService.saveToCache(recipientRes.data)
          .catch(e => console.error('Error occurred during saving to cache', e));
      }
    } catch (e) {
      console.error(e);
      response.status(500).send('Internal server error');
    }
  }
}
