import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { ImageModule } from './image/image.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { RateLimitMiddleware } from './common/middlewares/rate-limit.middleware';

@Module({
  imports: [BullModule.forRoot({
    connection: {
      host: "localhost",
      port: 6379
    }
  }), ImageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, RateLimitMiddleware).forRoutes('*')
  }
}
