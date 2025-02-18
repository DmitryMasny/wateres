import { Body, Controller, Post, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Request() req) {
    const userId = req.user.id;

    return this.authService.getCurrentUser(userId);
  }

  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @ApiOperation({ summary: 'Получить текущий токен для Swagger' })
  @Get('token')
  @UseGuards(JwtAuthGuard)
  getCurrentToken(@Request() req) {
    // Возвращаем токен в формате для удобной вставки в Swagger
    return {
      token: req.headers.authorization?.split(' ')[1],
      swaggerAuthUrl: `/api/docs/oauth2-redirect.html?token=${req.headers.authorization?.split(' ')[1]}`,
    };
  }
}
