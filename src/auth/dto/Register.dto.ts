import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { StrongPassword } from 'src/decorator/password.decorator';
import { UserGender } from 'src/profile/entities/profile.entity';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum Roles {
  Admin = 'admin',
  Lawyer = 'lawyer',
  Client = 'client',
}

export class RegisterDTO {
  @IsNotEmpty({ message: 'nama lengkap wajib di isi' })
  @IsString({ message: 'nama lengkap harus berupa format string' })
  full_name: string;

  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @IsEmail({}, { message: 'harus berformat email' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @StrongPassword({
    message:
      'Kata sandi minimal 8 karakter, harus di sertai huruf besar, kecil dan angka!',
  })
  password: string;

  @IsPhoneNumber('ID', {
    message: 'No hp harus berformat +62xxxxx!',
  })
  phone_number: string;

  @IsNotEmpty({ message: 'Jenis kelamin wajib di isi' })
  @IsEnum(Gender, { message: 'Jenis kelamin hanya boleh pria dan wanita' })
  gender: UserGender;

  @IsNotEmpty({ message: 'Role wajib di isi' })
  @IsEnum(Roles, { message: 'role hanya tersedia: admin, client, lawyer' })
  role: Roles;
}
