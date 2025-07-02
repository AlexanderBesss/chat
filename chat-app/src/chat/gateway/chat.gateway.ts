import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../service/chat.service';

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

  constructor(
    private readonly chatService: ChatService,
  ) { }

  handleDisconnect(client: Socket) {
    this.chatService.removeUser(client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { username: string; room: string },
  ) {
    this.chatService.joinRoom(client, data);
  }

  @SubscribeMessage('messageToRoom')
  async handleRoomMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { message: string },
  ) {
    return await this.chatService.publishRawMessage(client, data);
  }
}
