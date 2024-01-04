import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 100)
  fullName: string;

  @IsString()
  @IsEmail()
  email: string;

  @Length(8, 60)
  password: string;
}
