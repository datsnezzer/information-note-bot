/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Birthday } from 'src/model/birthday.entity';
import { BirthdayService } from 'src/service/birthday.service';

@Module({
  imports: [TypeOrmModule.forFeature([Birthday])],
  providers: [BirthdayService],
  exports: [BirthdayService],
})
export class BirthdayModule {}
