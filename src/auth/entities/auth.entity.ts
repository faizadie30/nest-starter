import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ type: 'text', nullable: true })
  refresh_token: string;

  @Column()
  refresh_token_expires_at: Date;
}
