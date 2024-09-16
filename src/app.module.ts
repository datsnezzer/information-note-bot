/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import * as LocalSession from 'telegraf-session-local';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { BotService } from './bot/bot.service';
import { BotModule } from './bot/bot.module';
import { NoteModule } from './module/note.module';
import { BirthdayModule } from './module/birthday.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ListModule } from './module/list.module';
import { ReminderModule } from './module/reminder.module';
import { UserCredentialModule } from './module/usercredential.module';

// const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      migrations: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    BotModule,
    NoteModule,
    BirthdayModule,
    ListModule,
    ReminderModule,
    UserCredentialModule,
  ],
  providers: [BotService],
})
export class AppModule {}
