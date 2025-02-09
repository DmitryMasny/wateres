import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service'; // убедитесь, что путь корректный

@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly authService: AuthService) {}

  // Маршрут, который перенаправляет пользователя на страницу авторизации Google
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // В этот момент пользователь уже перенаправляется на Google для аутентификации.
  }

  // Маршрут для обработки callback после авторизации в Google
  @Get('callback')
  @UseGuards(AuthGuard('google'))
  @Redirect('http://localhost:3000/auth/callback', 302)
  async googleAuthRedirect(@Req() req) {
    const user = req.user;
    const jwt = await this.authService.googleLogin(user);
    return { url: `http://localhost:3000/auth/callback?token=${jwt.token}` };
  }
}
