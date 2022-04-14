import {
    ConflictException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
  
  @EntityRepository(UserEntity)
  export class UserRepository extends Repository<UserEntity> {
   
  }
  