import { IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateBoardDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  users: User[];
}
