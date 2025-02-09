import { ApiProperty } from '@nestjs/swagger';
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/user.model';

interface PostCreationAttrs {
  title: string;
  content: string;
  userId: number;
  image: string;
}

@Table({ tableName: 'posts' })
export class Post extends Model<Post, PostCreationAttrs> {
  @ApiProperty({ example: '1', description: 'id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Заголовок поста' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  title: string;

  @ApiProperty({ example: 'Содержание поста' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content: string;

  @ApiProperty({ example: 'изображение' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ApiProperty({
    example: {
      id: 1,
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      image: 'https://example.com/image.jpg',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    description: 'автор поста',
  })
  @BelongsTo(() => User)
  author: User;
}
