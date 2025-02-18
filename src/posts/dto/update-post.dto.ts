import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({ example: 'Заголовок поста', description: 'Заголовок поста' })
  readonly title?: string;

  @ApiProperty({ example: 'Содержание поста', description: 'Содержание поста' })
  readonly content?: string;

  @ApiProperty({ example: true, description: 'Опубликован ли пост', required: false })
  readonly published?: boolean;
}
