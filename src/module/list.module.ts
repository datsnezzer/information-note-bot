/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from 'src/model/list.entity';
import { ListService } from 'src/service/list.service';

@Module({
  imports: [TypeOrmModule.forFeature([List])],
  providers: [ListService],
  exports: [ListService],
})
export class ListModule {}
