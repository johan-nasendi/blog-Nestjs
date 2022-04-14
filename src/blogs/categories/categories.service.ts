import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of, switchMap } from 'rxjs';
import { CategoryEntity } from 'src/entities/categories.entity';
import { Repository } from 'typeorm';
import { CategoryInterface } from './interface/category.interface';
const slugify = require('slugify');

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepisitory : Repository<CategoryEntity>,
    ) {}


    createdCaregory(categoriesIntf: CategoryInterface): Observable<CategoryInterface>{
        return this.generateSlug(categoriesIntf.category).pipe(
            switchMap((slug: string) => {
                categoriesIntf.slug = slug;
                return from(this.categoryRepisitory.save(categoriesIntf));
            })
        )
    }

    findAll(): Observable<CategoryInterface[]> {
        return from(this.categoryRepisitory.find());
    }

    findOne(id: number): Observable<CategoryInterface> {
        return from(this.categoryRepisitory.findOne({id}));
    }

    updateOne(id: number, categoriesIntf: CategoryInterface): Observable<CategoryInterface> {
        return from(this.categoryRepisitory.update(id, categoriesIntf)).pipe(
            switchMap(() => this.findOne(id))
        )
    }


    deleteOne(id: number): Observable<any> {
        return from(this.categoryRepisitory.delete(id));
    }


    generateSlug(category: string): Observable<string> {
        return of(slugify(category));
    }



    
   
      
    
}
