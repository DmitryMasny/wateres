import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@email.ru', description: 'Почтовый адрес' })
  readonly email: string;

  @ApiProperty({ example: 'qwerty78', description: 'Пароль' })
  readonly password: string;
}
