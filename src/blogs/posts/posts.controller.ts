import { Controller, Post, Body, Request, UseGuards, Get, Query, Param, Delete, Put, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { PostInterface } from './interface/post-entry.interface';
import { UserIsAuthorGuard } from '../guards/user-is-author.guard';
import { Image } from './interface/Image.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryInterface } from '../categories/interface/category.interface';


export const BLOG_ENTRIES_URL ='http://localhost:3000/api/posts';
export const storage = {
    storage: diskStorage({
        destination: './uploads/blog-entry-images',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })

}
@ApiTags('post')
@ApiBearerAuth()
@Controller('post')
export class PostsController {

    constructor(private blogService: PostsService) {}


    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body()blogEntry: PostInterface,categoriesInterface : CategoryInterface, @Request() req
    ): Observable<PostInterface> {
        const user = req.user;
        return this.blogService.create(user, blogEntry,categoriesInterface);
    }


    @Get('')
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        limit = limit > 100 ? 100 : limit;
        

        return this.blogService.paginateAll({
            limit: Number(limit),
            page: Number(page),
            route: BLOG_ENTRIES_URL
        })
    }


    @Get('user/:user')
    indexByUser(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Param('user') userId: number,
        
    ) {
        limit = limit > 100 ? 100 : limit;

        return this.blogService.paginateByUser({
            limit: Number(limit),
            page: Number(page),
            route: BLOG_ENTRIES_URL + '/user/' + userId 
        }, Number(userId))
    }

    @Get(':id')
    findOne(@Param('id') id: number): Observable<PostInterface> {
        return this.blogService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Put(':id')
    updateOne(@Param('id') id: number, @Body() blogEntry: PostInterface): Observable<PostInterface> {
        return this.blogService.updateOne(Number(id), blogEntry);
    }

    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: number): Observable<any> {
        return this.blogService.deleteOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('image/upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<Image> {
        return of(file);
    }

    @Get('image/:imagename')
    findImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/blog-entry-images/' + imagename)));
    }

}
