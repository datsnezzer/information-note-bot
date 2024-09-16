/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from 'src/model/reminder.entity';
import { ReminderService } from 'src/service/reminder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder])],
  providers: [ReminderService],
  exports: [ReminderService],
})
export class ReminderModule {}
