import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { AuthGuard } from 'src/auth/auth.guard';

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

  @Post(':id/invite')
  @UseGuards(AuthGuard)
  invitePeopleToBoard(@Body() email: string, @Param('id') boardId: string) {
    return this.boardService.invitePeopleToBoard(email, boardId);
  }
}
