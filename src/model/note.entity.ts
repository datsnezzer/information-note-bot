/* eslint-disable prettier/prettier */

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'note' })
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column()
  label: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
