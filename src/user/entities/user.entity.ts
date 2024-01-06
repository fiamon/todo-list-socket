import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from 'src/board/entities/task.entity';
import { Board } from 'src/board/entities/board.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  full_name: string;

  @OneToMany(() => Task, (task) => task.assigned_user_id)
  tasks: Task[];

  @ManyToMany(() => Board, (board) => board.users)
  @JoinTable()
  boards: Board[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    const salt = 10;
    this.password = bcrypt.hashSync(this.password, salt);
  }
}
