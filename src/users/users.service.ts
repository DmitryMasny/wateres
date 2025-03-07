import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.model';
import { AddRoleDto } from './dto/add-role.dto';
import { Op } from 'sequelize';

// import { BanUserDto } from './dto/ban-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private UserRepository: typeof User,
    private roleService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.UserRepository.create(dto);

    const role = await this.roleService.getRoleByValue('USER');
    if (!role) {
      throw new HttpException('Регистрация закрыта (Ошибка роли)', HttpStatus.NOT_FOUND);
    }
    await user.$set('roles', [role.id]);
    user.roles = [role];

    return user;
  }

  async getAllUsers() {
    const users = await this.UserRepository.findAll({ include: { all: true } });
    return users;
  }

  async getUserById(id: number) {
    const user = await this.UserRepository.findOne({
      where: { id },
      include: { all: true },
    });
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.UserRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.UserRepository.findByPk(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);
    if (role && user) {
      await user.$add('role', role.id);
      return dto;
    }
    throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
  }

  async findOrCreateGoogleUser(profile: any) {
    const user = await this.UserRepository.findOne({
      where: {
        [Op.or]: [{ googleId: profile.id }, { email: profile.email }],
      },
    });

    if (user) {
      // Если пользователь найден, обновляем googleId если его нет
      if (!user.googleId) {
        await user.update({ googleId: profile.id });
      }
      return user;
    }

    // Создаем нового пользователя
    const newUser = await this.UserRepository.create({
      email: profile.email,
      googleId: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
    });

    // Назначаем роль USER
    const role = await this.roleService.getRoleByValue('USER');
    await newUser.$set('roles', [role.id]);
    newUser.roles = [role];

    return newUser;
  }

  async deleteUser(id: number) {
    const user = await this.UserRepository.findByPk(id);

    if (!user) {
      throw new UnauthorizedException('Неверный userId');
    }

    await user.destroy();
  }

  // async ban(dto: BanUserDto) {
  //   const user = await this.UserRepository.findByPk(dto.userId);
  //   if (!user) {
  //     throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  //   }
  //   // user.banned = true;
  //   // user.banReason = dto.banReason;
  //   await user.save();
  //   return user;
  // }
}
