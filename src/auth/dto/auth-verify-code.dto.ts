import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class AuthVerifyCodeDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  @ApiProperty({ example: 'user@email.ru', description: 'Почтовый адрес' })
  readonly email: string;

  @ApiProperty({ example: '123456', description: 'Проверочный код' })
  readonly code: string;
}
