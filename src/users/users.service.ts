import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private configService: ConfigService,
  ) {}

  async findByEmail(email: string): Promise<Users | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findOne(id: number): Promise<Users | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Users[]> {
    return await this.userRepository.find();
  }

  async create(user: Partial<Users>): Promise<Users> {
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async update(id: number, dto: Partial<Users>): Promise<Users> {
    return await this.userRepository.save({ id, ...dto });
  }

  async updateRefreshToken(userId: number, token: string): Promise<void> {
    const salt = bcrypt.genSaltSync();

    const hashed = await bcrypt.hash(token, salt);

    await this.userRepository.update(userId, { refreshToken: hashed });
  }

  async getMe(userId: number): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }
}
