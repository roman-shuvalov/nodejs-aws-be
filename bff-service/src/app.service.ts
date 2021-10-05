import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RecipientService } from './common/service/recipient.service';
import { RequestService } from './common/service/request.service';

@Injectable()
export class AppService {
  constructor(
    private readonly requestService: RequestService,
    private readonly recipientService: RecipientService,
    private readonly httpService: HttpService,
  ) {}

  createRequestConfig() {
    const recipient = this.recipientService.get();
    const baseURL = this.recipientService.getUrl(recipient);
    const method = this.requestService.getMethod();
    const url = this.requestService.getOriginalUrl();
    const body = this.requestService.getBody();

    return {
      baseURL,
      method,
      url,
      // headers: req.headers,
      ...(Object.keys(body).length > 0 && { data: body })
    }
  }

  forwardRequest(config) {
    return this.httpService.request({
      ...config,
      validateStatus: false
    }).toPromise();
  }
}
