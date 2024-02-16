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

  async create(createBoardDto: CreateBoardDto, user: string) {
    const board = this.boardRepository.create(createBoardDto);
    const owner = await this.userRepository.findOne({
      where: { id: user },
    });
    board.users = [owner];
    await this.boardRepository.save(board);
    socketEvent(`updateTasks-${board.id}`, 'newBoard', {
      board,
    });
    return board;
  }

  async findTodosByBoardId(id: string) {
    const findedBoard = await this.boardRepository.findOne({
      where: { id },
      relations: {
        tasks: {
          assigned_user_id: true,
        },
        users: true,
      },
    });
    return findedBoard;
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
    await this.boardRepository.save(board);

    sendMail(email);
  }

  async deleteBoard(boardId: string) {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    await this.boardRepository.remove(board);
  }

  async createTask(createTaskDTO: CreateTaskDTO) {
    const task = this.taskRepository.create(createTaskDTO);
    await this.taskRepository.save(task);

    const user = await this.taskRepository.findOne({
      where: { id: task.id },
      relations: {
        assigned_user_id: true,
      },
    });

    socketEvent(`updateTasks-${task.assigned_board_id}`, 'newTask', {
      task,
      user,
    });
  }

  async updateTask(taskId: string, status: string) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: {
        assigned_user_id: true,
        assigned_board_id: true,
      },
    });
    task.status = status;
    await this.taskRepository.save(task);
    socketEvent(`updateTasks-${task.assigned_board_id.id}`, 'updateTask', {
      task: task,
      assignedBoard: task.assigned_board_id,
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

  async findBoardsAssignedToUser(user: string) {
    const boards = await this.userRepository.findOne({
      where: { id: user },
      relations: {
        boards: true,
      },
    });
    return boards;
  }
}
