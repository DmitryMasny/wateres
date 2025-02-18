import { Body, Controller, Post, Put, Delete, Param, ParseIntPipe, UploadedFile, UseInterceptors, Get } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { Post as PostModel } from './posts.model';

@ApiTags('Посты')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Создание поста' })
  @ApiResponse({ status: 201, type: PostModel })
  @UseInterceptors(FileInterceptor('image'))
  createPost(@Body() dto: CreatePostDto, @UploadedFile() image: string) {
    return this.postsService.create(dto, image);
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех опубликованных постов' })
  @ApiResponse({ status: 200, type: [PostModel] })
  getPublishedPosts() {
    return this.postsService.getPublishedPosts();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновление поста' })
  @ApiResponse({ status: 200, type: PostModel })
  @UseInterceptors(FileInterceptor('image'))
  updatePost(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto, @UploadedFile() image?: string) {
    return this.postsService.update(id, dto, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление поста' })
  @ApiResponse({ status: 200 })
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Получение всех постов пользователя' })
  @ApiResponse({ status: 200, type: [PostModel] })
  @ApiParam({ name: 'userId', description: 'ID пользователя' })
  getUserPosts(@Param('userId', ParseIntPipe) userId: number) {
    return this.postsService.getUserPosts(userId);
  }
}
