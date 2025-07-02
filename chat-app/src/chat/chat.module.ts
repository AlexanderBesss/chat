import { Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './service/chat.service';
import { SqsClientService } from './service/sqs/sqs.client.service';
import { SqsConsumerService } from './service/sqs/sqs.consumer.service';
import { SqsProducerService } from './service/sqs/sqs.producer.service';

@Module({
  imports: [MessageModule],
  providers: [
    ChatGateway,
    SqsConsumerService,
    SqsProducerService,
    SqsClientService,
    ChatService,
  ],
})
export class ChatModule {}
