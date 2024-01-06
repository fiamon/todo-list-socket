import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToMany(() => User, (board) => board.boards)
  users: User[];

  @OneToMany(() => Task, (task) => task.assigned_board_id)
  tasks: Task[];

  @CreateDateColumn()
  created_at: Date;
}
