import { Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, of, from, switchMap, map } from 'rxjs';
import { PostsEntryEntity } from 'src/entities/post.entity';
import { UserInterface } from 'src/user/interface/user.interface';
import { UserService } from 'src/user/user.service';
import {  Repository } from 'typeorm';
import { PostInterface } from './interface/post-entry.interface';
import { Pagination, IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { CategoryInterface } from '../categories/interface/category.interface';
import { TagsInterface } from '../tags/interface/tag.interface';
const slugify = require('slugify');

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsEntryEntity)
        private readonly blogRepository : Repository<PostsEntryEntity>,
        private readonly userService : UserService,
    ){}


    create(
        user: UserInterface,
         blogEntry: PostInterface,
         categoriesIntf : CategoryInterface,
         ): Observable<PostInterface> {
        blogEntry.author = user;
        console.log(blogEntry);
        const postTags = this.blogRepository
        .createQueryBuilder("posts")
        .leftJoinAndSelect("posts.tags", "tags")
        .getMany(); 
        return this.generateSlug(blogEntry.title).pipe(
            switchMap((slug: string, category: number) => {
                blogEntry.slug = slug;
                blogEntry.id = category;
                postTags
                return from(this.blogRepository.save(blogEntry));
            })
        )
    }

    findAll(): Observable<PostInterface[]> {
        return from(this.blogRepository.find(
            {relations: ['author','category','tags']},
            ));
    }

    paginateAll(options: IPaginationOptions): Observable<Pagination<PostInterface>> {
        return from(paginate<PostsEntryEntity>(this.blogRepository, options, {
            relations: ['author','category','tags']
        })).pipe(
            map((blogEntries: Pagination<PostInterface>) => blogEntries)
        )
    }

    paginateByUser(options: IPaginationOptions, userId: number): Observable<Pagination<PostInterface>> {
        return from(paginate<PostsEntryEntity>(this.blogRepository, options, {
            relations: ['author','category','tags'],
            where: [
                {author: userId},
                
            ]
        })).pipe(
            map((blogEntries: Pagination<PostInterface>) => blogEntries)
        )
    }


    findOne(id: number): Observable<PostInterface> {
        return from(this.blogRepository.findOne({id}, {relations: ['author']}));
    }

    findByUser(userId: number): Observable<PostInterface[]> {
        return from(this.blogRepository.find({
            where: {
                author: userId
            },
            relations: ['author']
        })).pipe(map((blogEntries: PostInterface[]) => blogEntries))
    }

    updateOne(id: number, blogEntry: PostInterface): Observable<PostInterface> {
        return from(this.blogRepository.update(id, blogEntry)).pipe(
            switchMap(() => this.findOne(id))
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.blogRepository.delete(id));
    }

    generateSlug(title: string): Observable<string> {
        return of(slugify(title));
    }

} 
