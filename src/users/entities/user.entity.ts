// src/resources/users/entities/user.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from 'nest-starter/src/roles/entities/role.entity';
import { IsEmail, IsMobilePhone } from 'class-validator';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ name: 'profile_image', nullable: true })
  profileImage: string;

  @Column({ name: 'email', unique: true, nullable: true })
  @IsEmail()
  email: string;

  @Column({ name: 'is_email_verfied', type: 'bool', default: false })
  isEmailVerfied: boolean;

  @Column({ name: 'mobile', unique: true, nullable: true })
  @IsMobilePhone()
  mobile: string;

  @Column({ name: 'is_mobile_verfied', type: 'bool', default: false })
  isMobileVerfied: boolean;

  @Column({ name: 'plan_id', type: 'integer', nullable: true })
  planId: number;

  @CreateDateColumn()
  createdAt: number;

  @Column({ name: 'password' })
  @Exclude()
  password: string;

  @ManyToMany(() => Role, {
    nullable: true,
  })
  @JoinTable()
  Roles: Role[];
}
