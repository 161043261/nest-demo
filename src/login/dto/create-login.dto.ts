import { IsNotEmpty, IsString, Length, IsNumber } from 'class-validator';

export class CreateLoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 7, {
    message: 'name.length >= 3 && name.length <= 7',
  })
  name: string;

  @IsNumber()
  age: number;
}
