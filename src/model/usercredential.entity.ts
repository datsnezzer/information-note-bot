/* eslint-disable prettier/prettier */

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_credential' })
export class UserCredential {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  pin: string;
}
