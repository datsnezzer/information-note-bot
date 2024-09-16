/* eslint-disable prettier/prettier */

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'list' })
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  list_name: string;

  @Column({ type: 'text', nullable: true })
  items: string;

  @Column({ default: false })
  is_done: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
