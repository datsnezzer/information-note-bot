/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/model/list.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List) private readonly listRepository: Repository<List>,
  ) {}

  async createList(list_name: string, items: string): Promise<List> {
    const list = this.listRepository.create({ list_name, items });
    return this.listRepository.save(list);
  }

  async addItem(list_name: string, items: string): Promise<List> {
    const lists = this.listRepository.create({ list_name, items });
    return this.listRepository.save(lists);
  }

  async removeItem(items: string): Promise<void> {
    await this.listRepository.delete({ items });
  }

  async updateItem(items: string, is_done: boolean): Promise<List> {
    const item = await this.listRepository.findOne({ where: { items } });
    if (item) {
      item.is_done = is_done;
      return this.listRepository.save(item);
    }
    return null;
  }

  async getLists(list_name: string): Promise<List[]> {
    return this.listRepository.find({ where: { list_name } });
  }

  async getAllLists(): Promise<List[]> {
    return this.listRepository.find();
  }

  async exportListsToTxt(): Promise<string> {
    const notes = await this.getAllLists();
    const filePath = path.join(__dirname, 'lists.txt');
    const fileContent =
      'Your lists:\n' +
      notes
        .map(
          (list) =>
            `List name: ${list.list_name} - List items: ${list.items} - Status: ${list.is_done ? 'Completed' : 'Not completed'}`,
        )
        .join('\n');
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    return filePath;
  }

  async exportListsToCsv(): Promise<string> {
    const notes = await this.getAllLists();
    const filePath = path.join(__dirname, 'lists.csv');
    const fileContent =
      'Your lists:\n' +
      notes
        .map(
          (list) =>
            `List name: ${list.list_name} - List items: ${list.items} - Status: ${list.is_done ? 'Completed' : 'Not completed'}`,
        )
        .join('\n');
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    return filePath;
  }
}
