import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { IUser, IUserFull } from './interfaces';
import { toUserFull, toUserResponse } from './transformers';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    const user = await this.usersService.create(createUserDto);
    return toUserResponse(user);
  }

  @Get()
  async getAllUsers(): Promise<IUser[]> {
    const users = await this.usersService.getAllUsers();
    return users.map(toUserResponse);
  }

  @Get('me')
  async getMe(@Req() req: Request & { user: { id: string } }): Promise<IUserFull> {
    const user = await this.usersService.getMe(req.user.id);
    return toUserFull(user);
  }

  @Get('profile/:id')
  async findOne(@Param('id') id: string): Promise<IUser> {
    const user = await this.usersService.getUserById(id);
    return toUserResponse(user);
  }

  @Patch('profile/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<IUser> {
    const user = await this.usersService.update(id, updateUserDto);
    return toUserResponse(user);
  }

  @Delete('profile/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}

