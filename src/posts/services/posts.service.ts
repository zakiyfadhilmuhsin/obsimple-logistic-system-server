import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity) private postsRepository: Repository<PostEntity>
    ) {}

    async create(createPostDto: CreatePostDto) {
        const newPost = await this.postsRepository.create(createPostDto);
        await this.postsRepository.save(newPost);
        return newPost;
    }

    async findAll(pageOptionsDto: PageOptionsDto) {
        const queryBuilder = this.postsRepository.createQueryBuilder("posts");
        
        queryBuilder
            .orderBy("posts.createdAt", pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

        return new PageDto(entities, pageMetaDto);
    }

    async findOne(id: number) {
        const post = await this.postsRepository.findOne({ where: {id: id} });
        if(post) {
            return post;
        }
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
        await this.postsRepository.update(id, updatePostDto);
        const updatedPost = await this.postsRepository.findOne({ where: { id: id } });
        if(updatedPost) {
            return updatedPost;
        }
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    async remove(id: number) {
        const deleteResponse = await this.postsRepository.delete(id);
        if(!deleteResponse.affected) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
    }
}
