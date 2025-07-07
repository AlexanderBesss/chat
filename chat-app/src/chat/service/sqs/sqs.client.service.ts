import { SQSClient } from '@aws-sdk/client-sqs';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ENV } from '../../../env';

@Injectable()
export class SqsClientService implements OnModuleDestroy {
  private readonly sqsClient: SQSClient;

  constructor() {
    this.sqsClient = new SQSClient({
      region: ENV.AWS_REGION,
      endpoint: ENV.SQS_ENDPOINT,
      credentials: {
        accessKeyId: ENV.AWS_ACCESS_KEY_ID,
        secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  get client(): SQSClient {
    return this.sqsClient;
  }

  onModuleDestroy() {
    this.sqsClient.destroy();
  }
}
