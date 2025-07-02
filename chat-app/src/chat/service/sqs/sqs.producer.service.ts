import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { SqsClientService } from './sqs.client.service';

@Injectable()
export class SqsProducerService {
  constructor(private readonly sqsClientService: SqsClientService) {}

  async sendMessage(queueUrl: string, payload: any): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(payload),
    });

    await this.sqsClientService.client.send(command);
  }
}
