/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Note } from 'src/model/note.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
  ) {}

  async createNote(label: string, content: string): Promise<Note> {
    const note = this.noteRepository.create({ label, content });
    return this.noteRepository.save(note);
  }

  async findNotesByLabel(label: string): Promise<Note[]> {
    return this.noteRepository.find({ where: { label } });
  }

  async getAllLabels(): Promise<Note[]> {
    return this.noteRepository.find();
  }

  async findNotesByKeyword(userId: number, keyword: string): Promise<Note[]> {
    return this.noteRepository
      .createQueryBuilder('note')
      .where('note.userId = :userId', { userId })
      .andWhere('note.content ILIKE :keyword OR note.label ILIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .getMany();
  }

  async delete(id: number): Promise<void> {
    await this.noteRepository.delete(id);
  }

  async exportNotesToTxt(): Promise<string> {
    const notes = await this.getAllLabels();
    const filePath = path.join(__dirname, 'notes.txt');
    const fileContent =
      'Your notes:\n' +
      notes
        .map((note) => `Label: ${note.label} - Content: ${note.content}`)
        .join('\n');
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    return filePath;
  }

  async exportNotesToCsv(): Promise<string> {
    const notes = await this.getAllLabels();
    const filePath = path.join(__dirname, 'notes.csv');
    const fileContent =
      'Your notes:\n' +
      notes
        .map((note) => `Label: ${note.label} - Content: ${note.content}`)
        .join('\n');
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    return filePath;
  }
}
