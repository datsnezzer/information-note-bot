/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/model/note.entity';
import { NoteService } from 'src/service/note.service';

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}
