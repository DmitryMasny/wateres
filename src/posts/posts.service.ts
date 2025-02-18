import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { FilesService } from '../files/files.service';
import { User } from 'src/users/user.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private filesService: FilesService,
  ) {}

  async create(dto: CreatePostDto, image: any) {
    const fileName = await this.filesService.createFile(image);
    const post = await this.postRepository.create({ ...dto, image: fileName });
    return post;
  }

  async update(id: number, dto: UpdatePostDto, image?: any) {
    const post = await this.postRepository.findByPk(id);

    if (!post) {
      throw new NotFoundException(`Пост с ID ${id} не найден`);
    }

    const updateData: any = { ...dto };

    if (image) {
      const fileName = await this.filesService.createFile(image);
      if (fileName) {
        updateData.image = fileName;
      }
    }

    await post.update(updateData);
    return post;
  }

  async delete(id: number) {
    const post = await this.postRepository.findByPk(id);

    if (!post) {
      throw new NotFoundException(`Пост с ID ${id} не найден`);
    }

    await post.destroy();
    return { message: `Пост с ID ${id} успешно удален` };
  }

  async getPublishedPosts() {
    const posts = await this.postRepository.findAll({
      where: { published: true },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'email'],
        },
      ],
    });
    return posts;
  }

  async getUserPosts(userId: number) {
    const posts = await this.postRepository.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return posts;
  }
}
