/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reminder } from 'src/model/reminder.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReminderService {
  private reminders: Reminder[] = [];

  constructor(
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,
  ) {}

  async createReminder(
    chatId: number,
    message: string,
    reminderTime: Date,
  ): Promise<void> {
    const reminder = this.reminderRepository.create({
      chatId,
      message,
      reminderTime,
    });
    await this.reminderRepository.save(reminder);
  }

  async getPendingReminders(): Promise<Reminder[]> {
    return this.reminderRepository.find({
      where: { reminderTime: LessThanOrEqual(new Date()) },
    });
  }

  removeReminder(chatId: number, message: string, reminderTime: Date) {
    this.reminders = this.reminders.filter(
      (r) =>
        r.chatId !== chatId ||
        r.message !== message ||
        r.reminderTime.getTime() !== reminderTime.getTime(),
    );
  }

  async sendReminder(chatId: number, message: string, ctx: any) {
    await ctx.telegram.sendMessage(chatId, `🔔 Reminder: ${message}`);
  }

  async getAllReminders(): Promise<Reminder[]> {
    return this.reminderRepository.find();
  }

  async exportRemindersToTxt(): Promise<string> {
    const notes = await this.getAllReminders();
    const filePath = path.join(__dirname, 'reminders.txt');
    const fileContent =
      'Your reminders list:\n' +
      notes
        .map(
          (reminder) =>
            `Message: ${reminder.message} - Time: ${reminder.reminderTime}`,
        )
        .join('\n');
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    return filePath;
  }

  async exportRemindersToCsv(): Promise<string> {
    const notes = await this.getAllReminders();
    const filePath = path.join(__dirname, 'reminders.csv');
    const fileContent =
      'Your reminders list:\n' +
      notes
        .map(
          (reminder) =>
            `Message: ${reminder.message} - Time: ${reminder.reminderTime}`,
        )
        .join('\n');
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    return filePath;
  }
}
