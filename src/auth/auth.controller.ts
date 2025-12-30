import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Cookies } from 'src/common/decorators/cookies.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { Response } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginIn(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      dto.email,
      dto.password,
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken };
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('refresh-token')
  async refreshToken(
    @Cookies('refreshToken') token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const { accessToken, refreshToken } =
      await this.authService.createNewAccessToken(token);

    // Update refresh token in cookie
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken };
  }

  @Post('change-password')
  changePassword(
    @Body() dto: ChangePasswordDto,
    @Req() req: Request & { user: { sub: number } },
  ) {
    return this.authService.changePassword(dto, req.user.sub);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<string> {
    await this.authService.resetPassword(dto);
    return 'Password reset successfully';
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<string> {
    await this.authService.forgotPassword(dto);
    return 'Email sent successfully';
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<string> {
    await this.authService.verifyOtp(dto);
    return 'Verified email successfully';
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(
    @Req() req: Request & { user: { sub: number } },
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    console.log('UserId', req);
    await this.authService.logout(req.user.sub);

    response.cookie('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
    });

    return 'Logged out successfully';
  }
}
