import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'Заголовок поста', description: 'Заголовок поста' })
  readonly title: string;

  @ApiProperty({ example: 'Содержание поста', description: 'Содержание поста' })
  readonly content: string;

  @ApiProperty({ example: '1', description: 'id пользователя' })
  readonly userId: number;

  @ApiProperty({ example: 'image.jpg', required: false })
  readonly image?: string;

  @ApiProperty({ example: true, description: 'Опубликован ли пост', required: false })
  readonly published?: boolean;
}
