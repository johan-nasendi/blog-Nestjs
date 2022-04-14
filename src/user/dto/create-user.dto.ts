import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
  } from 'class-validator';

  
  export class CreateUserDTOP {

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    @MaxLength(20)
    username: string;
  
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @ApiProperty()
    profileImage: string;
  
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
      {
        message: '8 to 20 characters must be used as a combination of numbers, English letters, and special characters.',
      },
    )
    password: string;

    @ApiProperty()
    @IsString()
    role: string;

   
  
  }
  