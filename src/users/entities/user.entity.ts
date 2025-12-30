import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ name: 'otp_code', default: null, unique: true })
  otpCode: string;

  @Column({ name: 'otp_expired_at', default: null })
  otpExpiredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
