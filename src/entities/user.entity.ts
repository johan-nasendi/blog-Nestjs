import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    BeforeInsert,
  } from 'typeorm';
  import { Exclude } from 'class-transformer';
  import { UserRole } from 'src/user/interface/user.interface';
  import  {PostsEntryEntity}  from './post.entity';
  
  
  @Entity('users')
  export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column({ unique: true })
    username: string;
  
    @Column({ unique: true })
    email: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole;

    @Column({nullable: true})
    profileImage: string;

    @Column({select: false})
    password: string;
  
    @Column({ default: false })
    verified: boolean;
  
    @Column({ nullable: true })
    @Exclude()
    currentHashedRefreshToken?: string;
  
    @CreateDateColumn() // entity special column
    createdAt: Date;
  
    @UpdateDateColumn() // entity update special column
    updatedAt: Date;
  
    @OneToMany(type => PostsEntryEntity , blogEntryEntity => blogEntryEntity.author)
    PostEntries: PostsEntryEntity [];

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
  }
  