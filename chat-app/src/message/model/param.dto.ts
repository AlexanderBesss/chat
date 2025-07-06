import * as zod from 'zod';

export const ParamSchema = zod.object({
  room: zod.string().nonempty(),
});

export type ParamDto = zod.infer<typeof ParamSchema>;
