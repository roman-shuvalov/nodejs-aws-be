import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getMethod(): string {
    return this.request.method;
  }

  getOriginalUrl(): string {
    return this.request.originalUrl;
  }

  getBody(): string {
    return this.request.body;
  }
}
