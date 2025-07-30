import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmpService } from './emp.service';
import { CreateEmpDto } from './dto/create-emp.dto';
import { UpdateEmpDto } from './dto/update-emp.dto';

@Controller('emp')
export class EmpController {
  constructor(private readonly empService: EmpService) {}

  @Post()
  create(@Body() createEmpDto: CreateEmpDto) {
    return this.empService.create(createEmpDto);
  }

  @Get()
  findAll() {
    return this.empService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empService.findOne(Number.parseInt(id, 10));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmpDto: UpdateEmpDto) {
    return this.empService.update(Number.parseInt(id, 10), updateEmpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empService.remove(Number.parseInt(id, 10));
  }
}
