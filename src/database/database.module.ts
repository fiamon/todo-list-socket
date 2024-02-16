import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from 'src/board/entities/board.entity';
import { Task } from 'src/board/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'todo1234',
  database: 'todo-list-db',
  uuidExtension: 'uuid-ossp',
  entities: [User, Board, Task],
  synchronize: true,
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return { ...dataSourceOptions };
      },
    }),
  ],
})
export class DatabaseModule {}
