import { IsIn } from 'class-validator';

export class UpdateTaskDto {
  @IsIn(['to-do', 'doing', 'done'])
  status: 'to-do' | 'doing' | 'done';
}
