import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Board } from './entities/board.entity';
import { socketEvent } from 'src/externals/pusher.socket';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Task)
    private taskRepository: Repository<Task>,

    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto, user: User) {
    const board = this.boardRepository.create(createBoardDto);
    const owner = await this.userRepository.findOne({
      where: { id: user.id },
    });
    board.users = [owner];
    socketEvent(`updateTasks-${board.title}`, 'new-task', {
      message: 'hello',
    });
    await this.boardRepository.save(board);
  }

  async findTodosByBoardId(id: string) {
    const findedBoard = await this.boardRepository.findOne({
      where: { id },
    });
    const tasks = await this.taskRepository.find({
      where: {
        assigned_board_id: findedBoard,
      },
    });

    return tasks;
  }

  async invitePeopleToBoard(email: string, id: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    console.log(user);

    const board = await this.boardRepository.findOne({
      where: { id },
      relations: {
        tasks: true,
        users: true,
      },
    });
    board.users = [...board.users, user];
  }
}