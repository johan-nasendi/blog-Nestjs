import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of, switchMap } from 'rxjs';
import { TagsEntity } from 'src/entities/tag.entity';
import { Repository } from 'typeorm';
import { TagsInterface } from './interface/tag.interface';
const slugify = require('slugify');

@Injectable()
export class TagsService {

    constructor(
        @InjectRepository(TagsEntity)
        private readonly tagRepository : Repository<TagsEntity>,
    ) {}

    cratedTags(tagsInterface: TagsInterface) : Observable<TagsInterface> {

        return this.generateSlug(tagsInterface.tag).pipe(
            switchMap((slug: string) => {
                tagsInterface.slug = slug;
                return from(this.tagRepository.save(tagsInterface));
            })
        )
    }


    findAll(): Observable<TagsInterface[]> {
        return from(this.tagRepository.find());
    }

    findOne(id: number): Observable<TagsInterface> {
        return from(this.tagRepository.findOne({id}));
    }

    updateOne(id: number, categoriesIntf: TagsInterface): Observable<TagsInterface> {
        return from(this.tagRepository.update(id, categoriesIntf)).pipe(
            switchMap(() => this.findOne(id))
        )
    }


    deleteOne(id: number): Observable<any> {
        return from(this.tagRepository.delete(id));
    }


    generateSlug(tag: string): Observable<string> {
        return of(slugify(tag));
    }
}
