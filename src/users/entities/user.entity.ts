import { Channel } from 'src/channel/entities/channel.entity';
import { TopicPermission } from 'src/topics/entities/topic-permission.entity';
import { Topic } from 'src/topics/entities/topic.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity("users")
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ default: 25 })
  age: number;

  @Column({ default: 1 })
  exp: number;

  @Column({ default: 1 })
  level: number;

  @Column({ name: 'avatar_url', default: null })
  avatarUrl: string;

  @Column({ default: 'vn' })
  country: string;

  @Column({ name: 'password_hash', default: null })
  passwordHash: string;

  @Column({ name: 'refresh_token', default: null })
  refreshToken: string;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @Column({ name: 'otp_code', type: 'varchar', length: 6, unique: true, nullable: true })
  otpCode: string | null;

  @Column({ name: 'otp_expired_at', type: 'varchar', nullable: true })
  otpExpiredAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Topic, (topic) => topic.user)
  topics: Topic[];

  @OneToMany(() => TopicPermission, (topicPermission) => topicPermission.user)
  topicPermissions: TopicPermission[];

  @OneToOne(() => Channel, (channel) => channel.user)
  channel: Channel;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
