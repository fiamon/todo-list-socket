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
    const user = req.user;
    return this.boardService.create(createBoardDto, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findTodosByBoardId(@Param('id') id: string) {
    return this.boardService.findTodosByBoardId(id);
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


}
