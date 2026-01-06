import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Topic } from 'src/topics/entities/topic.entity';
import { TopicPermission } from 'src/topics/entities/topic-permission.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(user: Partial<User>): Promise<User> {
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async update(id: string, dto: Partial<User>): Promise<User> {
    return await this.userRepository.save({ id, ...dto });
  }

  async updateRefreshToken(userId: string, token: string): Promise<void> {
    const salt = bcrypt.genSaltSync();

    const hashed = await bcrypt.hash(token, salt);

    await this.userRepository.update(userId, { refreshToken: hashed });
  }

  async getMe(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['topics', 'topicPermissions']
    });

    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }

  async getTopics(userId: string): Promise<Topic[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['topics', 'topicPermissions']
    });

    if (!user) throw new UnauthorizedException('User not found');

    return user.topics;
  }

  async getTopicPermissions(userId: string): Promise<TopicPermission[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['topics', 'topicPermissions']
    });

    if (!user) throw new UnauthorizedException('User not found');

    return user.topicPermissions;
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async checkUserExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return !!user;
  }
}
