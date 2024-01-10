import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Board } from './entities/board.entity';
import { socketEvent } from 'src/externals/pusher/pusher.socket';
import { sendMail } from 'src/externals/mailer/send-email';
import { CreateTaskDTO } from './dto/create-task.dto';

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
    socketEvent(`updateTasks-${board.title}`, 'new-board', {
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

  async invitePeopleToBoard(email: string, boardId: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException();
    }
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: {
        tasks: true,
        users: true,
      },
    });
    board.users = [...board.users, user];
    sendMail(email);
  }

  async createTask(createTaskDTO: CreateTaskDTO) {
    const task = this.taskRepository.create(createTaskDTO);
    console.log(task);
    await this.taskRepository.save(task);

    socketEvent(`updateTasks-${task.assigned_board_id.title}`, 'newTask', {
      newTask: task,
    });
  }

  async updateTask(taskId: string, status: string) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });
    task.status = status;
    await this.taskRepository.save(task);

    socketEvent(`updateTasks-${task.assigned_board_id.title}`, 'updateTask', {
      taskId: task.id,
      task,
    });

    return task;
  }

  async deleteTask(taskID: string) {
    const task = await this.taskRepository.findOne({
      where: { id: taskID },
      relations: { assigned_board_id: true },
    });
    if (task) {
      socketEvent(`updateTasks-${task.assigned_board_id.title}`, 'deleteTask', {
        taskId: task.id,
        task,
      });
      await this.taskRepository.remove(task);
    }
  }
}
