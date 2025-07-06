import * as zod from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const EnvSchema = zod.object({
  db_host: zod.string().nonempty(),
  db_port: zod.number(),
  db_username: zod.string().nonempty(),
  db_password: zod.string().nonempty(),
  database_name: zod.string().nonempty(),
  app_port: zod.number(),

  AWS_REGION: zod.string().nonempty(),
  AWS_ACCESS_KEY_ID: zod.string().nonempty(),
  AWS_SECRET_ACCESS_KEY: zod.string().nonempty(),
  aws_raw_sqs_url: zod.string().url(),
  aws_clean_sqs_url: zod.string().url(),
  sqs_endpoint: zod.string().nonempty(),
});

type EnvPayload = zod.infer<typeof EnvSchema>;

export const ENV: EnvPayload = {
  db_host: process.env.db_host!,
  db_port: Number(process.env.db_port),
  db_username: process.env.db_username!,
  db_password: process.env.db_password!,
  database_name: process.env.database_name!,
  app_port: Number(process.env.app_port),

  AWS_REGION: process.env.AWS_REGION!,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  aws_raw_sqs_url: process.env.aws_raw_sqs_url!,
  aws_clean_sqs_url: process.env.aws_clean_sqs_url!,
  sqs_endpoint: process.env.sqs_endpoint!,
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
