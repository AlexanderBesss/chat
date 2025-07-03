import * as zod from 'zod';

export const ChatUserSchema = zod.object({
  username: zod.string().nonempty(),
  room: zod.string().nonempty(),
});

export type ChatUserDto = zod.infer<typeof ChatUserSchema>;

export const ChatMessageSchema = zod.object({
  content: zod.string().nonempty(),
});

export type ChatMessageDto = zod.infer<typeof ChatMessageSchema>;
