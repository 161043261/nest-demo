import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

type WithProps<T> = T | T[keyof T];

@Injectable()
export class LoginPipe implements PipeTransform {
  async transform(
    value: WithProps<typeof CreateUserDto>,
    metadata: ArgumentMetadata,
  ) {
    /** @Body(LoginPipe) */
    // value: { name: 'whoami', age: 23 }
    // metadata: { metatype: [class CreateLoginDto], type: 'body', data: undefined }

    /** @Body('name', LoginPipe) */
    // value: whoami
    // metadata: { metatype: [Function: String], type: 'body', data: 'name' }

    /** @Body('age', LoginPipe) */
    // value: 23
    // metadata: { metatype: [Function: String], type: 'body', data: 'age' }
    console.log('[loginPipe] value:', value);
    console.log('[loginPipe] metadata:', metadata);
    if (metadata.metatype) {
      const typedValue = plainToInstance(metadata.metatype, value) as WithProps<
        typeof CreateUserDto
      >;

      // typedValue: CreateLoginDto { name: 'whoami', age: 23 }
      // typedValue: whoami
      // typedValue: 23;
      console.log('[loginPipe] typedValue:', typedValue);
      const aggregateErrors: ValidationError[] = await validate(typedValue);
      console.log('[loginPipe] aggregateErrors:', aggregateErrors);
      if (aggregateErrors.length) {
        throw new HttpException(aggregateErrors, HttpStatus.BAD_REQUEST);
      }
    }

    return value;
  }
}
