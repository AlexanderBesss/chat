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

  aws_region: zod.string().nonempty(),
  aws_access_key_id: zod.string().nonempty(),
  aws_secret_key: zod.string().nonempty(),
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

  aws_region: process.env.aws_region!,
  aws_access_key_id: process.env.aws_access_key_id!,
  aws_secret_key: process.env.aws_secret_key!,
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
