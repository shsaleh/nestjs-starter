import { IsNotEmpty } from 'class-validator';
import { Permission } from 'nest-starter/src/permissions/entities/permission.entity';
import { User } from 'nest-starter/src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  user: User[];

  @ManyToMany(() => Permission, {
    nullable: true,
  })
  @JoinTable()
  permissions: Permission[];

  @Column({ unique: true })
  @IsNotEmpty()
  name: string;
}
