import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { Role } from '../roles/roles.model';
import { RolesModule } from '../roles/roles.module';
import { UserRoles } from '../roles/user-roles.model';
import { User } from '../users/user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Post } from 'src/posts/posts.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([User, Role, UserRoles, Post]), RolesModule, forwardRef(() => AuthModule)],
  exports: [UsersService],
})
export class UsersModule {}
