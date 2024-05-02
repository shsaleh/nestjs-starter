import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Module } from './module.entity';

@Entity()
@Unique(['action', 'moduleId'])
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column()
  moduleId: number;

  @ManyToOne(() => Module, (module) => module.id, { nullable: true })
  module: Module;
}
