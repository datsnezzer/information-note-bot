/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredential } from 'src/model/usercredential.entity';
import { UserCredentialService } from 'src/service/usercredential.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserCredential])],
  providers: [UserCredentialService],
  exports: [UserCredentialService],
})
export class UserCredentialModule {}
