import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Board } from 'src/board/entities/board.entity';
import { Task } from 'src/board/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Board, Task])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
