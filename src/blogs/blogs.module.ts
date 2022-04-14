import { forwardRef, Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { CategoriesModule } from './categories/categories.module';
import { UserModule } from 'src/user/user.module';


@Module({
  imports: [
    forwardRef(() => UserModule),
    PostsModule, 
    TagsModule, 
    CategoriesModule
  ]
})
export class BlogsModule {}
