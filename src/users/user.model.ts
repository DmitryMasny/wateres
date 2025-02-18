import { ApiProperty } from '@nestjs/swagger';
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Post } from 'src/posts/posts.model';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';

export interface UserCreationAttrs {
  email: string;
  password?: string;
  googleId?: string;
  firstName?: string;
  lastName?: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'description' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'user@email.ru', description: 'Почтовый адрес' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @ApiProperty({ example: 'google_oauth_token', required: false })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  googleId: string;

  @ApiProperty({ example: 'John', required: false })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstName: string;

  @ApiProperty({ example: 'Doe', required: false })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @ApiProperty({ type: () => [Post] })
  @HasMany(() => Post)
  posts: Post[];
}
