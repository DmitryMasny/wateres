import { ApiProperty } from '@nestjs/swagger';
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/user.model';

export interface PostCreationAttrs {
  title: string;
  content: string;
  userId: number;
  image: string;
  published?: boolean;
}

@Table({ tableName: 'posts' })
export class Post extends Model<Post, PostCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Заголовок поста', description: 'Заголовок поста' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @ApiProperty({ example: 'Содержание поста', description: 'Текст поста' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content: string;

  @ApiProperty({ example: 'image.jpg', description: 'Имя файла изображения' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image: string;

  @ApiProperty({ example: '1', description: 'ID автора поста' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ApiProperty({ type: () => User, description: 'Автор поста' })
  @BelongsTo(() => User)
  author: User;

  @ApiProperty({ example: true, description: 'Опубликован ли пост' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  published: boolean;
}
