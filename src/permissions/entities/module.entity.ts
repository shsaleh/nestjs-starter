import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
