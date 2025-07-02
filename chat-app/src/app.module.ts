import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { ChatModule } from './chat/chat.module';
import { ENV } from './env';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    MessageModule,
    ChatModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: ENV.db_host,
      port: ENV.db_port,
      username: ENV.db_username,
      password: ENV.db_password,
      database: ENV.database_name,
      entities: [__dirname + '**/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
