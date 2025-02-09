import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  public async generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);

    if (user) {
      const passwordEquals = await bcrypt.compare(userDto.password, user.password);

      if (user && passwordEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({ message: 'Некорректные данные' });
  }

  async validateOAuthUser(userData: { email: string; firstName: string; lastName: string }) {
    let user = await this.userService.getUserByEmail(userData.email);

    if (!user) {
      // Создаем нового пользователя с случайным паролем, так как OAuth не требует пароля
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashPassword = await bcrypt.hash(randomPassword, 5);
      user = await this.userService.createUser({
        email: userData.email,
        password: hashPassword,
        // firstName: userData.firstName,
        // lastName: userData.lastName
      });
    }

    return user;
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails } = profile;
    const userData = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };
    console.log('profile', profile);
    const user = await this.validateOAuthUser(userData);
    done(null, user);
  }

  async googleLogin(user: User) {
    return this.generateToken(user);
  }
}
