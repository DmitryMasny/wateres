import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './google.strategy';
import { GoogleAuthController } from './google-auth.controller';
import { EmailModule } from '../email/email.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthCode } from './auth-code.model';

@Module({
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController, GoogleAuthController],
  imports: [
    forwardRef(() => UsersModule),
    EmailModule,
    JwtModule.register({
      secret: process.env.SECRET || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    SequelizeModule.forFeature([AuthCode]),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
