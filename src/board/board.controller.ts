import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Put,
  Patch,
  Delete,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  create(@Body() createBoardDto: CreateBoardDto, @Request() req) {
    const user = req.user.sub;
    return this.boardService.create(createBoardDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAllBoards(@Request() req) {
    const user = req.user.sub;
    return this.boardService.findBoardsAssignedToUser(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findTodosByBoardId(@Param('id') id: string) {
    return this.boardService.findTodosByBoardId(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteBoard(@Param('id') boardId: string) {
    return this.boardService.deleteBoard(boardId);
  }

  @Put(':id/invite/:email')
  @UseGuards(AuthGuard)
  invitePeopleToBoard(
    @Param('email') email: string,
    @Param('id') boardId: string,
  ) {
    return this.boardService.invitePeopleToBoard(email, boardId);
  }

  @Post('task')
  @UseGuards(AuthGuard)
  createTask(@Body() createTaskDTO: CreateTaskDTO) {
    return this.boardService.createTask(createTaskDTO);
  }

  @Patch('task/:id')
  @UseGuards(AuthGuard)
  updateTask(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param(':id') taskId: string,
  ) {
    return this.boardService.updateTask(taskId, updateTaskDto.status);
  }

  @Delete('task/:id')
  @UseGuards(AuthGuard)
  deleteTask(@Param('id') taskId: string) {
    return this.boardService.deleteTask(taskId);
  }
}
