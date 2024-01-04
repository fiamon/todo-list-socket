import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const doesUserAlreadyExists = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (doesUserAlreadyExists) {
      throw new HttpException('User already exists', 400);
    }

    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }
}
