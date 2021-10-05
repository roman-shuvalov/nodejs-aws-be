import { Module, NestModule, MiddlewareConsumer, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipientService } from './common/service/recipient.service';
import { RequestService } from './common/service/request.service';
import { CacheService } from './common/service/cache.service';
import { CacheRecipientMiddleware } from './common/middleware/cache-recipient.middleware';
import { CheckRecipientMiddleware } from './common/middleware/check-recipient.middleware';

const imports = [ConfigModule.forRoot(), HttpModule, CacheModule.register()];
const controllers = [AppController];
const providers = [CacheService, AppService, RequestService, RecipientService];

@Module({
  imports,
  controllers,
  providers,
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(CheckRecipientMiddleware, CacheRecipientMiddleware)
      .forRoutes(AppController);
  }
}
