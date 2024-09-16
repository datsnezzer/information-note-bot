/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { NoteModule } from 'src/module/note.module';
import { BirthdayModule } from 'src/module/birthday.module';
import { ListModule } from 'src/module/list.module';
import { ReminderModule } from 'src/module/reminder.module';
import { UserCredentialModule } from 'src/module/usercredential.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        token: process.env.KEY_API,
      }),
    }),
    NoteModule,
    BirthdayModule,
    ListModule,
    ReminderModule,
    UserCredentialModule,
  ],
  providers: [BotService],
})
export class BotModule {}
