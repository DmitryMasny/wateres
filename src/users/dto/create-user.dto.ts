import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  @ApiProperty({ example: 'user@email.ru', description: 'Почтовый адрес' })
  readonly email: string;

  @ApiProperty({ example: 'qwerty78', description: 'Пароль' })
  readonly password: string;
}
