import { IsIn, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Board } from '../entities/board.entity';

export class CreateTaskDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsIn(['to-do', 'doing', 'done'])
  status: 'to-do' | 'doing' | 'done';

  @IsString()
  assigned_user_id: User;

  @IsString()
  assigned_board_id: Board;
}
