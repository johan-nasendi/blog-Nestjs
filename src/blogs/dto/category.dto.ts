import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty,IsString,} from 'class-validator';

  
  export class CreateCategoryDTOP {

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    category: string;

    @ApiProperty()
    @IsString()
    slug: string;
  
   
  
  }
  