import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailService } from 'src/mail/mail.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generateTokens(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '1m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException("User doesn't exist");
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'User is not active. Please verify your email',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Password doesn't match");
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      email,
    );

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async register(registerPayload: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(
      registerPayload.email,
    );

    if (existingUser) {
      throw new UnauthorizedException(
        'The user with this email already exists',
      );
    }

    const otpCode = this.generateOtpCode();

    void this.mailService.sendMail({
      to: registerPayload.email,
      subject: 'Verify your email',
      template: 'register-account',
      context: { name: registerPayload.fullName, otp: otpCode },
    });

    const salt = bcrypt.genSaltSync();

    const passwordHash = await bcrypt.hash(registerPayload.password, salt);

    const newUser = {
      fullName: registerPayload.fullName,
      email: registerPayload.email,
      passwordHash,
      otpCode,
      otpExpiredAt: new Date(Date.now() + 1000 * 60 * 5),
    };

    return await this.usersService.create(newUser);
  }

  async createNewAccessToken(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify JWT token first
    let payload: { sub: number; email: string };
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new ForbiddenException('Invalid refresh token');
    }

    const userId = payload.sub;
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException("User doesn't exist");
    }

    // Compare token with stored hash (correct order: plaintext, hash)
    const isMatch = await bcrypt.compare(token, user.refreshToken);

    if (!isMatch) {
      throw new ForbiddenException('Refresh token mismatch');
    }

    // Generate new tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
    );

    // Update refresh token in database
    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async changePassword(payload: ChangePasswordDto, userId: number) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException("User doesn't exist");
    }

    const isPasswordValid = await bcrypt.compare(
      payload.oldPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const salt = bcrypt.genSaltSync();
    const newHashedPassword = await bcrypt.hash(payload.password, salt);

    await this.usersService.update(userId, {
      passwordHash: newHashedPassword,
    });

    return { message: 'Password changed successfully' };
  }

  async resetPassword(payload: ResetPasswordDto) {
    let payloadToken: { sub: number; email: string };

    try {
      payloadToken = await this.jwtService.verifyAsync(payload.token);
    } catch {
      throw new ForbiddenException('Invalid or expired reset token');
    }

    const user = await this.usersService.findOne(payloadToken.sub);

    if (!user) {
      throw new UnauthorizedException("User doesn't exist");
    }

    const salt = bcrypt.genSaltSync();
    const newHashedPassword = await bcrypt.hash(payload.password, salt);

    await this.usersService.update(user.id, {
      passwordHash: newHashedPassword,
    });
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException("User doesn't exist");
    }

    const token = await this.jwtService.signAsync(
      { sub: user.id, email: user.email },
      { expiresIn: '2m' },
    );

    const link = `${this.configService.get('FRONTEND_URL')}/auth/reset-password?email=${user.email}&token=${token}`;

    void this.mailService.sendMail({
      to: user.email,
      subject: 'Reset your password',
      template: 'reset-password',
      context: { name: user.fullName, link },
    });
  }

  async clearOtpCode(userId: number): Promise<void> {
    await this.usersService.update(userId, {
      otpCode: undefined,
      otpExpiredAt: undefined,
    });
  }

  async verifyOtp(payload: VerifyOtpDto) {
    const user = await this.usersService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException("User doesn't exist");
    }

    if (user.otpCode === undefined || user.otpExpiredAt === undefined) {
      throw new UnauthorizedException('Try to login first');
    }

    if (user.otpCode !== payload.otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    const isOtpExpired = user.otpExpiredAt && new Date() > user.otpExpiredAt;

    await this.clearOtpCode(user.id);

    if (isOtpExpired) throw new UnauthorizedException('OTP is expired');

    await this.usersService.update(user.id, {
      isActive: true,
    });
  }

  async logout(userId: number): Promise<void> {
    await this.usersService.update(userId, { refreshToken: undefined });
  }
}
