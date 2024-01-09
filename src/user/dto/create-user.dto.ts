import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 100)
  full_name: string;

  @IsString()
  @IsEmail()
  email: string;

  @Length(8, 60)
  @IsStrongPassword({
    minLowercase: 1,
  })
  password: string;
}
