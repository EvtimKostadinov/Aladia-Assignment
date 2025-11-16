import {
  Body,
  Controller,
  Get,
  Post,
  ValidationPipe,
  HttpException,
} from '@nestjs/common';
import { NetworkingService } from '@core/networking/networking.service';
import { CreateUserDto, UserRto } from '@common/dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { catchError, firstValueFrom } from 'rxjs';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly networkingService: NetworkingService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: UserRto })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists.',
  })
  async registerUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<UserRto> {
    return firstValueFrom(
      this.networkingService
        .send<UserRto>({ cmd: 'register_user' }, createUserDto)
        .pipe(
          catchError((error) => {
            throw new HttpException(error.message, error.statusCode);
          }),
        ),
    );
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [UserRto] })
  async getUsers(): Promise<UserRto[]> {
    return firstValueFrom(
      this.networkingService.send<UserRto[]>({ cmd: 'get_all_users' }, {}),
    );
  }
}
