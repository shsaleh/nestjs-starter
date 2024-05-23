import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { FileType } from '../fileTypes.enum';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ nullable: true })
  // userId: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  user: User;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  type: FileType;

  @Column()
  extention: string;
}
