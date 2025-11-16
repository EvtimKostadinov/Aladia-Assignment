import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from '@common/dto/create-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'register_user' })
  async registerUser(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.registerUser(createUserDto);
  }

  @MessagePattern({ cmd: 'get_all_users' })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
