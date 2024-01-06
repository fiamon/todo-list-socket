import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from './board.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'SET NULL' })
  assigned_user_id: User;

  @ManyToOne(() => Board, (board) => board.tasks)
  assigned_board_id: Board;

  @CreateDateColumn()
  created_at: Date;
}
