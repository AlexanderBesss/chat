import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ENV } from '../../env';
import { Message } from '../../message/model/message.entity';
import {
  MESSAGE_SERVICE_PROVIDER,
  MessageService,
} from '../../message/service/message.service';
import { SqsConsumerService } from './sqs/sqs.consumer.service';
import { SqsProducerService } from './sqs/sqs.producer.service';

@Injectable()
export class ChatService implements OnModuleInit {
  private _server: Server;
  set server(server: Server) {
    this._server = server;
  }

  private users: Record<string, { username: string; room: string }> = {};

  constructor(
    @Inject(MESSAGE_SERVICE_PROVIDER)
    private readonly messageService: MessageService,
    private readonly sqsConsumerService: SqsConsumerService,
    private readonly sqsProducerService: SqsProducerService,
  ) { }

  async onModuleInit() {
    this.sqsConsumerService.handleEvents(
      ENV.aws_clean_sqs_url,
      async (message) => this.broadcastMessage(message),
    );
  }

  async processCleanMessage(message: Message) {
    await this.messageService.saveMessage(message);
  }

  async publishRawMessage(client: Socket, data: { message: string }): Promise<void> {
    const user = this.users[client.id];
    if (!user) {
      return;
    }
    await this.sqsProducerService.sendMessage(ENV.aws_raw_sqs_url, {
      userId: user.username,
      room: user.room,
      content: data.message,
    });
  }

  async broadcastMessage(message: any) {
    await this.processCleanMessage(message);
    this._server.to(message.user.room).emit('messageFromRoom', {
      username: message.user.username,
      message: message.data.message,
    });
  }

  removeUser(id: string) {
    const user = this.users[id];
    if (user) {
      delete this.users[id];
    }
  }

  joinRoom(client: Socket, data: { username: string; room: string }) {
    const { username, room } = data;
    client.join(room);
    this.users[client.id] = { username, room };
    client.to(room).emit('userJoined', {
      username,
      message: `${username} has joined the room.`,
    });
    client.emit('joinedRoom', {
      room,
      message: `You joined room: ${room}`,
    });
  }
}
