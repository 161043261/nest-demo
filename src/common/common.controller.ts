import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommonService } from './common.service';
import { UpdateCommonDto } from './dto/update-common.dto';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  // curl http://localhost:3000/common/1
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('[findOne] typeof id', typeof id); // string
    return this.commonService.findOne(Number.parseInt(id, 10));
  }

  // curl -X PATCH http://localhost:3000/common/1
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommonDto: UpdateCommonDto,
  ) {
    console.log('[update] typeof id:', typeof id); // number
    return this.commonService.update(id, updateCommonDto);
  }

  // curl -X DELETE http://localhost:3000/common/[uuid]
  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    console.log('[remove] typeof uuid:', typeof uuid); // string
    return this.commonService.remove(uuid);
  }
}
