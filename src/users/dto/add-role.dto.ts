import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddRoleDto {
  @ApiProperty({ example: 'ADMIN', description: 'Роль' })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Роль не может быть пустой' })
  readonly value: string;

  @ApiProperty({ example: 1, description: 'id пользователя' })
  @IsNumber({}, { message: 'Должно быть числом' })
  readonly userId: number;
}
