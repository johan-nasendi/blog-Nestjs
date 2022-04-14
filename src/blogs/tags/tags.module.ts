import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsEntity } from 'src/entities/tag.entity';
import { UserModule } from 'src/user/user.module';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([TagsEntity]),
    UserModule,
  ],
  controllers: [TagsController],
  providers: [TagsService]
})
export class TagsModule {}
