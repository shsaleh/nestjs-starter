import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { notification_type } from '../types';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  user: User[];

  @Column({ nullable: true })
  destination: string;

  @Column({ nullable: true })
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  type: notification_type;
}
