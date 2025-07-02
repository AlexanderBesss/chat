import * as zod from 'zod';

export const PaginationSchema = zod.object({
  limit: zod
    .string()
    .optional()
    .transform((value) => (!value ? 10 : parseInt(value, 10)))
    .refine((num) => Number.isInteger(num) && num >= 1 && num <= 100, {
      message: 'Limit must be an integer between 1 and 100',
    }),
  skip: zod
    .string()
    .optional()
    .transform((value) => (!value ? 0 : parseInt(value, 10)))
    .refine((num) => Number.isInteger(num) && num >= 0, {
      message: 'Skip must be an integer >= 0',
    }),
});

export type PaginationDto = zod.infer<typeof PaginationSchema>;
