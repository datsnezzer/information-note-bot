/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Birthday } from 'src/model/birthday.entity';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BirthdayService {
  constructor(
    @InjectRepository(Birthday)
    private readonly birthdayRepository: Repository<Birthday>,
  ) {}

  private birthdays: { userId: number; name: string; date: Date }[] = [];

  async addBirthday(userId: number, name: string, date: Date): Promise<void> {
    const birthday = new Birthday();
    birthday.name = name;
    birthday.date = date;
    birthday.userId = userId;
    await this.birthdayRepository.save(birthday);
  }

  async getUpcomingBirthdays(): Promise<Birthday[]> {
    const tomorrow = dayjs().add(1, 'day').startOf('day').toDate();

    return this.birthdayRepository
      .createQueryBuilder('birthday')
      .where('birthday.date = :tomorrow', { tomorrow })
      .getMany();
  }

  async getAllBirthdays(): Promise<Birthday[]> {
    return this.birthdayRepository.find();
  }

  async exportBirthdaysToTxt(): Promise<string> {
    const notes = await this.getAllBirthdays();
    const filePath = path.join(__dirname, 'birthdays.txt');
    const fileContent =
      'Your birthdays list:\n' +
      notes
        .map(
          (birthday) =>
            `Name: ${birthday.name} - Date of birth: ${birthday.date}`,
        )
        .join('\n');
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    return filePath;
  }

  async exportBirthdaysToCsv(): Promise<string> {
    const notes = await this.getAllBirthdays();
    const filePath = path.join(__dirname, 'birthdays.csv');
    const fileContent =
      'Your birthdays list:\n' +
      notes
        .map(
          (birthday) =>
            `Name: ${birthday.name} - Date of birth: ${birthday.date}`,
        )
        .join('\n');
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    return filePath;
  }
}
