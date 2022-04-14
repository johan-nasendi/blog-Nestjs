import {
      Column,
      CreateDateColumn,
      Entity,
      ManyToOne,
      OneToMany,
      OneToOne,
      PrimaryGeneratedColumn,
      UpdateDateColumn,
    } from 'typeorm';
import { PostsEntryEntity } from './post.entity';
    
    
    @Entity({name:'categories'})
    export class CategoryEntity   {
      @PrimaryGeneratedColumn()
      id: number;
    
      @Column()
      category: string;

      @Column()
      slug: string;
    
      @CreateDateColumn() // entity special column
      createdAt: Date;
    
      @UpdateDateColumn() // entity update special column
      updatedAt: Date;
    
      @OneToMany(() => PostsEntryEntity, posts => posts.category)
       postCategory: PostsEntryEntity[];


    }