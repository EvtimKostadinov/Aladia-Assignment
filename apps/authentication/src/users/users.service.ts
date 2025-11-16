import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from '@common/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async registerUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new RpcException({
        statusCode: 409,
        message: 'User with this email already exists.',
      });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    const user = await this.usersRepository.create(createUserDto, passwordHash);
    const { passwordHash: _, ...result } = user.toObject();
    return result;
  }

  async getAllUsers() {
    const users = await this.usersRepository.findAll();
    return users.map(user => {
        const { passwordHash: _, ...result } = user.toObject();
        return result;
    });
  }
}
