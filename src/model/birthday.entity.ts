/* eslint-disable prettier/prettier */

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'birthday' })
export class Birthday {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  userId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
