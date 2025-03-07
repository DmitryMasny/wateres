import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface AuthCodeCreationAttrs {
  email: string;
  code: string;
  password: string;
  expiresAt: Date;
}

@Table({ tableName: 'auth_codes' })
export class AuthCode extends Model<AuthCode, AuthCodeCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @ApiProperty({ example: '123456', description: 'Код авторизации' })
  @Column({ type: DataType.STRING, allowNull: false })
  code: string;

  @ApiProperty({ example: 'qwerty', description: 'Сохраняем пароль до подтверждения почты' })
  @Column({
    type: DataType.STRING,
  })
  password: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Время истечения кода' })
  @Column({ type: DataType.DATE, allowNull: false })
  expiresAt: Date;
}
