import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  SetMetadata,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { LoginGuard } from './login.guard';
import { ReqUrl, SetRoles } from 'src/custom/custom.decorator';

@Controller('login')
// 本模块中使用 LoginGuard 守卫
@UseGuards(LoginGuard)
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  // curl -X POST -H "Content-Type:application/json" -d '{"name":"whoami","age":23}' http://localhost:3000/login
  @Post()
  create(
    @Body() createLoginDto: CreateLoginDto,
    @Body('name') name: string,
    @Body('age') age: string,
  ) {
    // { name: 'whoami', age: 23 }
    console.log('[create] createLoginDto:', createLoginDto);
    // whoami
    console.log('[create] name:', name);
    // 23
    console.log('[create] age:', age);
    return this.loginService.create(createLoginDto);
  }

  // curl http://localhost:3000/login?role=admin
  @Get()
  @SetMetadata('roles', ['admin'])
  findAll() {
    return this.loginService.findAll();
  }

  // curl http://localhost:3000/login/1?role=user
  @Get(':id')
  @SetRoles('admin', 'user')
  findOne(@Param('id') id: string, @ReqUrl('myData') reqUrl: string) {
    console.log('[findOne] reqUrl:', reqUrl);
    return this.loginService.findOne(Number.parseInt(id, 10));
  }
}
