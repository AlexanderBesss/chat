import * as zod from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const EnvSchema = zod.object({
  DB_HOST: zod.string().nonempty(),
  DB_PORT: zod.number(),
  DB_USERNAME: zod.string().nonempty(),
  DB_PASSWORD: zod.string().nonempty(),
  DB_NAME: zod.string().nonempty(),
  APP_PORT: zod.number(),

  AWS_REGION: zod.string().nonempty(),
  AWS_ACCESS_KEY_ID: zod.string().nonempty(),
  AWS_SECRET_ACCESS_KEY: zod.string().nonempty(),
  AWS_RAW_SQS_URL: zod.string().url(),
  AWS_CLEAN_SQS_URL: zod.string().url(),
  SQS_ENDPOINT: zod.string().nonempty(),
});

type EnvPayload = zod.infer<typeof EnvSchema>;

export const ENV: EnvPayload = {
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USERNAME: process.env.DB_USERNAME!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_NAME: process.env.DB_NAME!,
  APP_PORT: Number(process.env.APP_PORT),

  AWS_REGION: process.env.AWS_REGION!,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  AWS_RAW_SQS_URL: process.env.AWS_RAW_SQS_URL!,
  AWS_CLEAN_SQS_URL: process.env.AWS_CLEAN_SQS_URL!,
  SQS_ENDPOINT: process.env.SQS_ENDPOINT!,
};

export function validateEnv(): void {
  const parsedEnv = EnvSchema.safeParse(ENV);
  console.log('Validating ENV variables!');
  if (!parsedEnv.success) {
    console.error(
      `Invalid environment variables: ${JSON.stringify(parsedEnv.error.format())}`,
    );
    process.exit(1);
  }
  console.log('Success!');
}
