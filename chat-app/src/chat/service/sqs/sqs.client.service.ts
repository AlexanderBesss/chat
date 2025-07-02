import { SQSClient } from '@aws-sdk/client-sqs';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ENV } from '../../../env';

@Injectable()
export class SqsClientService implements OnModuleDestroy {
  private readonly sqsClient: SQSClient;

  constructor() {
    this.sqsClient = new SQSClient({
      region: ENV.aws_region,
      endpoint: ENV.sqs_endpoint,
      credentials: {
        accessKeyId: ENV.aws_access_key_id,
        secretAccessKey: ENV.aws_secret_key,
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
