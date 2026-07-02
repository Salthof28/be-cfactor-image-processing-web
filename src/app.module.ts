import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { ImageModule } from './image/image.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { RateLimitMiddleware } from './common/middlewares/rate-limit.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
  BullModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      connection: {
        host: configService.get<string>('HOST_BULLMQ'),
        port: configService.get<number>('PORT_BULLMQ')
      }
    })
  }), ImageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, RateLimitMiddleware).forRoutes('*')
  }
}
