import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import {
  ChatMessageService,
  MESSAGE_SERVICE_PROVIDER,
} from '../service/message.service';
import { PaginationDto, PaginationSchema } from '../model/pagination.dto';
import { Message } from '../model/message.entity';
import { ResponseList } from '../model/message.response';
import { ZodValidationPipe } from '../pipe/zod.validation.pipe';
import { ParamnDto, ParamSchema } from '../model/param.dto';

@Controller('messages')
export class MessageController {
  constructor(
    @Inject(MESSAGE_SERVICE_PROVIDER)
    private readonly messageService: ChatMessageService,
  ) { }

  @Get(':room')
  getRoomMessages(
    @Param(new ZodValidationPipe(ParamSchema)) params: ParamnDto,
    @Query(new ZodValidationPipe(PaginationSchema)) pagination: PaginationDto,
  ): Promise<ResponseList<Message>> {
    return this.messageService.findAllByRoom(params.room, pagination);
  }

  @Get()
  getMessages(
    @Query(new ZodValidationPipe(PaginationSchema)) pagination: PaginationDto,
  ): Promise<ResponseList<Message>> {
    return this.messageService.findAll(pagination);
  }
}
