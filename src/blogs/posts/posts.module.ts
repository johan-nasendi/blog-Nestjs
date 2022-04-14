import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntryEntity } from 'src/entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsEntryEntity]),
    UserModule
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
