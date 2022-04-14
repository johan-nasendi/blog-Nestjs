
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, BeforeUpdate, ManyToOne, JoinColumn, OneToOne, OneToMany, ManyToMany, JoinTable, } from "typeorm";
import { CategoryEntity } from "./categories.entity";

import { TagsEntity } from "./tag.entity";
import { UserEntity } from "./user.entity";



@Entity('posts')
export class PostsEntryEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    slug: string;

    @Column({default: ''})
    description: string;

    @Column({default: ''})
    content: string;


    @Column({default: 0})
    likes: number;
    
    @Column({nullable: true})
    Image: string;

    @Column({nullable: true})
    video: string;
    
    @Column({nullable: true})
    publishedDate: Date;
    
    @Column({nullable: true})
    isPublished: boolean;
    
    @ManyToOne(type => UserEntity, user => user.PostEntries)
    author: UserEntity;

    @ManyToOne(() => CategoryEntity, profile => profile.postCategory) // specify inverse side as a second parameter
    @JoinColumn()
    category: CategoryEntity;

    @ManyToMany(() => TagsEntity, tag => tag.Posts, {
        cascade: true})
      @JoinTable()
      tags: TagsEntity[];


    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    updatedAt: Date;
    
    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date;
    }

  addTags(community: TagsEntity) {
    if(this.tags == null) {
      this.tags = new Array<TagsEntity>();
    }
    this.tags.push(community);
  }
   
}