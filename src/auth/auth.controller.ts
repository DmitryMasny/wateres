import { Body, Controller, Post, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthVerifyCodeDto } from './dto/auth-verify-code.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Request() req) {
    const userId = req.user.id;
    return this.authService.getCurrentUser(userId);
  }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({ status: 200, description: 'Возвращает JWT токен', type: AuthResponseDto })
  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @ApiOperation({ summary: 'Подтверждение email' })
  @ApiResponse({ status: 200, description: 'Возвращает JWT токен', type: AuthResponseDto })
  @Post('/verify-code')
  verifyAuthCode(@Body() dto: AuthVerifyCodeDto) {
    return this.authService.verifyEmailCode(dto.email, dto.code);
  }

  @ApiOperation({ summary: 'Получить текущий токен для Swagger' })
  @Get('/token')
  @UseGuards(JwtAuthGuard)
  getCurrentToken(@Request() req) {
    // Возвращаем токен в формате для удобной вставки в Swagger
    return {
      token: req.headers.authorization?.split(' ')[1],
      swaggerAuthUrl: `/api/docs/oauth2-redirect.html?token=${req.headers.authorization?.split(' ')[1]}`,
    };
  }
}
