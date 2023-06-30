import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query, 
  //UseInterceptors, 
  //ClassSerializerInterceptor 
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { JwtAuthGuard } from 'src/authentication/guards';
import { CreatePostDto, UpdatePostDto } from '../dtos';
import { PageOptionsDto } from 'src/common/dtos';

@Controller('posts')
//@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.postsService.findAll(pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
