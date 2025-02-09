import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './google.strategy';
import { GoogleAuthController } from './google-auth.controller';

@Module({
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController, GoogleAuthController],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.SECRET || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
