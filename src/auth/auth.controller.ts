import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: AuthDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthDto) {
    try {
      return this.authService.login(loginDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('me')
  @Auth()
  async me(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }

  @HttpCode(200)
  @Post('login/access-token')
  async getNewTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.getNewTokens(dto.refreshToken);
  }
}
