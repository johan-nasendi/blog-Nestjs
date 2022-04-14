import {
    BaseEntity,
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { UserEntity } from './user.entity';
  import { v4 as uuidv4 } from 'uuid';
  
  @Entity()
  export class Verifications extends BaseEntity  {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    code: string;
  
    @OneToOne((type) => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: UserEntity;
  
    @BeforeInsert()
    createCode(): void {
      this.code = uuidv4();
    }
  }
  