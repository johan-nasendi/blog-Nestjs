import {
    BaseEntity,
    ManyToMany,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinTable,
  } from 'typeorm';
import { PostsEntryEntity } from './post.entity';
  
  
  @Entity('tags')
  export class TagsEntity  {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    tag: string;

    @Column()
    slug: string;
  


    @ManyToMany(() =>PostsEntryEntity, post => post.tags)
    Posts: PostsEntryEntity[];

    @CreateDateColumn() // entity special column
    createdAt: Date;
  
    @UpdateDateColumn() // entity update special column
    updatedAt: Date;
  
  
  }
  