import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { EmailService } from 'src/email/email.service';
import { InjectModel } from '@nestjs/sequelize';
import { AuthCode } from './auth-code.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectModel(AuthCode) private authCodeRepository: typeof AuthCode,
  ) {}

  private generateToken(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
      roles: user.roles,
      googleId: user.googleId,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    if (!userDto.password || userDto.password.length < 3) {
      throw new HttpException('Некорректный пароль', HttpStatus.BAD_REQUEST);
    }
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
    }

    // Требуем подтвердить email
    const { email } = userDto;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const password = await bcrypt.hash(userDto.password, 5);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await this.authCodeRepository.destroy({ where: { email } });

    await this.authCodeRepository.create({
      email,
      code,
      password,
      expiresAt,
    });

    // Отправка кода на email
    await this.emailService.sendAuthCode(email, code);

    return { message: 'Код авторизации отправлен на указанный email' };
  }

  async verifyEmailCode(email: string, code: string): Promise<{ token: string }> {
    const authCode = await this.authCodeRepository.findOne({
      where: { email, code },
    });

    if (!authCode) {
      throw new UnauthorizedException('Неверный код авторизации');
    }

    if (new Date() > authCode.expiresAt) {
      await authCode.destroy();
      throw new UnauthorizedException('Срок действия кода истек');
    }

    const password = authCode.password;

    await authCode.destroy();

    let user = await this.userService.getUserByEmail(email);
    if (!user) {
      user = await this.userService.createUser({
        email,
        password,
      });
    }

    return this.generateToken(user);
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);

    if (user) {
      const passwordEquals = await bcrypt.compare(userDto.password, user.password);

      if (user && passwordEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({ message: 'Неправильный email или пароль' });
  }

  async googleLogin(user: User) {
    const currentUser = await this.userService.getUserById(user.id);
    console.log('currentUser', currentUser);
    return this.generateToken(currentUser);
  }

  async getCurrentUser(id: number) {
    const user = await this.userService.getUserById(id);
    if (user) {
      return {
        id: user.id,
        email: user.email,
        roles: user.roles,
        googleId: user.googleId,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    }

    throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  }
}
