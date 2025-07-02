import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from './controller/message.controller';
import { Message } from './model/message.entity';
import {
  ChatMessageService,
  MESSAGE_SERVICE_PROVIDER,
} from './service/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [MessageController],
  providers: [
    {
      provide: MESSAGE_SERVICE_PROVIDER,
      useClass: ChatMessageService,
    },
  ],
  exports: [MESSAGE_SERVICE_PROVIDER],
})
export class MessageModule {}
