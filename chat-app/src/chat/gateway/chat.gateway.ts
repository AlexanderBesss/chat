import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../service/chat.service';
import { ZodValidationPipe } from '../../common/pipe/zod.validation.pipe';
import {
  ChatMessageDto,
  ChatMessageSchema,
  ChatUserDto,
  ChatUserSchema,
} from '../model/chat.user';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  private server: Server;

  afterInit() {
    this.chatService.server = this.server;
  }

  constructor(private readonly chatService: ChatService) {}

  handleDisconnect(client: Socket) {
    this.chatService.removeUser(client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ZodValidationPipe(ChatUserSchema)) chatUser: ChatUserDto,
  ) {
    this.chatService.joinRoom(client, chatUser);
  }

  @SubscribeMessage('messageToRoom')
  async handleRoomMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ZodValidationPipe(ChatMessageSchema))
    chatMessage: ChatMessageDto,
  ) {
    return await this.chatService.publishRawMessage(client, chatMessage);
  }
}
