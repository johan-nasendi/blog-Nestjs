import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty,IsString,} from 'class-validator';

  
  export class CreatePostsDTOP {

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    slug: string;
  
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsNotEmpty()
    @ApiProperty()
    content: string;

    @ApiProperty()
    author: string;

    @ApiProperty()
    category: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    publishedDate: Date;

    @ApiProperty()
    isPublished: boolean;

    


  

    

   
  
  }
  