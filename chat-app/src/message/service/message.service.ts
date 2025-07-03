import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../model/message.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../model/pagination.dto';
import { ResponseList } from '../model/message.response';

export const MESSAGE_SERVICE_PROVIDER = Symbol('ChatMessageService');

export interface MessageService {
  saveMessage(message: Message): Promise<Message>;
}

@Injectable()
export class ChatMessageService implements MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly userRepository: Repository<Message>,
  ) { }

  async saveMessage(message: Message): Promise<Message> {
    const newMessage = this.userRepository.create(message);
    return this.userRepository.save(newMessage);
  }

  async findAllByRoom(
    room: string,
    pagination: PaginationDto,
  ): Promise<ResponseList<Message>> {
    const filter = {
      where: {
        room,
      },
    }
    return await this.findAll(pagination, filter);
  }

  async findAll(pagination: PaginationDto, filters?: any): Promise<ResponseList<Message>> {
    const [messages, totalCount] = await this.userRepository.findAndCount({
      ...filters,
      order: { createdAt: 'ASC' },
      skip: pagination.skip,
      take: pagination.limit,
    });
    return {
      data: messages,
      totalCount,
      pagination,
    };
  }
}
