import { IsEmail, Length } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsEmail()
  @Index({ unique: true })
  email: string;

  @Column()
  @Length(8, 60)
  password: string;

  @Column()
  @Length(3, 100)
  fullName: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    const salt = 10;
    this.password = bcrypt.hashSync(this.password, salt);
  }
}
