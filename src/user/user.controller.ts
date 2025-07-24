import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Req,
  Query,
  Headers,
  HttpCode,
  Res,
  Session,
  Inject,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
// import { CommonService } from 'src/common/common.service';

// @Controller('user')
@Controller({
  path: 'user',
  version: '1', // v1
})
export class UserController {
  constructor(
    @Inject('MyUserService') private readonly userService: UserService,
    // private readonly commonService: CommonService,
    @Inject('commonConfig') private readonly config: unknown,
  ) {}

  // POST 请求, 请求体参数
  // curl -X POST -d "k1=v1&k2=v2"  http://localhost:3000/v1/user
  @Post()
  create(
    @Req() req: ExpressRequest,
    @Body() body: CreateUserDto,
    @Body('k1') k1: string,
    @Body('k2') k2: string,
  ) {
    console.log('[create] req.body:', req.body); // { k1: 'v1', k2: 'v2' }
    console.log('[create] body:', body); // { k1: 'v1', k2: 'v2' }
    console.log('[create] k1:', k1); // v1
    console.log('[create] k2:', k2); // v2
    return this.userService.create(body);
  }

  @Post('create')
  createUser(
    @Session() session: Record<string, unknown>,
    @Body('username') username?: string,
    @Body('password') password?: string,
    @Body('captcha') captcha?: string,
  ) {
    if (session.captchaText === captcha?.toLowerCase()) {
      return {
        code: 200,
        message: `[Nest] session.captchaText ${session.captchaText as string} === captcha ${captcha}`,
      };
    } else {
      return {
        code: 400,
        message: `[error] session.captchaText ${session.captchaText as string} !== captcha ${captcha}`,
      };
    }
  }

  // GET 请求, 查询参数
  // curl http://localhost:3000/v1/user?k3=v3&k4=v4
  @Get()
  findAll(
    @Req() /** @Request() */ req: ExpressRequest,
    @Query() query: unknown,
    @Query('k3') k3: string,
    @Query('k4') k4: string,
  ) {
    console.log('[findAll] req.query:', req.query); // { k3: 'v3', k4: 'v4' }
    console.log('[findAll] query:', query); // { k3: 'v3', k4: 'v4' }
    console.log('[findAll] k3:', k3); // v3
    console.log('[findAll] k4:', k4); // v4
    return this.userService.findAll();
  }

  // GET 请求, url 路径参数
  // curl http://localhost:3000/v2/user/3/whoami
  @Get(':id/:name')
  @Version('2') // v2
  findOne(
    @Req() req: ExpressRequest,
    @Param() params: unknown,
    @Param('id') id: string,
    @Param('name') name: string,
  ) {
    console.log('[findOne] req.params:', req.params); // { id: '3', name: 'whoami' }
    console.log('[findOne] params:', params); // { id: '3', name: 'whoami' }
    console.log('[findOne] id:', id); // 3
    console.log('[findOne] name:', name); // whoami
    return this.userService.findOne(Number.parseInt(id, 10));
  }

  // curl -X PATCH -d "k5=v5&k6=v6" http://localhost:3000/v1/user/3
  @Patch(':id')
  @HttpCode(200) // 返回 http 状态码 200
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Headers() headers: unknown,
  ) {
    console.log('[update] id:', id); // 3
    console.log('[update] updateUserDto:', updateUserDto); // { k5: 'v5', k6: 'v6' }
    console.log('[update] headers:', headers);
    return this.userService.update(Number.parseInt(id, 10), updateUserDto);
  }

  // curl -X DELETE http://localhost:3000/v1/user/3
  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('[remove] this.config:', this.config); // { port: 3000 }
    return this.userService.remove(Number.parseInt(id, 10));
  }

  @Get('getCaptcha')
  getCaptcha(
    @Req() req: ExpressRequest,
    @Res() res: ExpressResponse,
    @Session() session: Record<string, unknown>,
  ) {
    res.type('image/svg+xml');
    const captcha = this.userService.getCaptcha();
    session.captchaText = captcha.text.toLowerCase();
    res.send(captcha.data);
  }
}
