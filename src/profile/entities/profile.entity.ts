import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type UserGender = 'male' | 'female' | '-';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true, length: 20 })
  phone_number: string;

  @Column({
    type: 'enum',
    enum: ['male', 'female', '-'],
    default: '-',
  })
  gender: UserGender;

  @Column({
    type: 'text',
    nullable: true,
  })
  place_birth: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  date_birth: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 20,
  })
  religion: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  job: string;

  @Column({ nullable: true })
  file_kyc: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  number_kyc: string;

  @Column({ nullable: true })
  address_kyc: string;

  @Column({ nullable: true })
  ward_kyc: string; // kelurahan

  @Column({ nullable: true })
  town_kyc: string; //kecamatan

  @Column({ nullable: true })
  city_kyc: string; //kota

  @Column({ nullable: true })
  province_kyc: string; //provinsi

  @Column({ nullable: true })
  address_domicile: string;

  @Column({ nullable: true })
  ward_domicile: string; // kelurahan

  @Column({ nullable: true })
  town_domicile: string; //kecamatan

  @Column({ nullable: true })
  city_domicile: string; //kota

  @Column({ nullable: true })
  province_domicile: string; //provinsi

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
