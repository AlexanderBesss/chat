import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
} from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { setTimeout } from 'node:timers/promises';
import { ENV } from '../../../env';
import { SqsClientService } from './sqs.client.service';

@Injectable()
export class SqsConsumerService {
  constructor(private readonly sqsClientService: SqsClientService) { }

  async handleEvents(
    queueUrl: string,
    callbackHandler: (message: any) => Promise<void>,
  ) {
    while (true) {
      try {
        const command = new ReceiveMessageCommand({
          QueueUrl: queueUrl,
          MaxNumberOfMessages: 1,
          WaitTimeSeconds: 1,
        });
        const response = await this.sqsClientService.client.send(command);
        const messages = response.Messages || [];
        const message = messages[0];
        if (message?.Body) {
          const body = JSON.parse(message.Body);
          console.log('Consumed message: ', body);
          // Register handler
          await callbackHandler(body);

          await this.sqsClientService.client.send(
            new DeleteMessageCommand({
              QueueUrl: ENV.aws_clean_sqs_url,
              ReceiptHandle: message.ReceiptHandle,
            }),
          );
        }
        await setTimeout(100);
      } catch (error) {
        console.error('Polling error', error);
      }
    }
  }
}
