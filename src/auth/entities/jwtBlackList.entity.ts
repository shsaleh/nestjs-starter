import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class JwtBlackList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'jwt_token' })
  jwtToken: string;

  @Column({
    name: 'expire_at',
    type: 'timestamp',
  })
  expireAt: Date;
}
