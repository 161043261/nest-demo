import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'node:path';
import { Response as ExpressResponse } from 'express';
import { createReadStream } from 'node:fs';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // 上传
  @Post()
  @UseInterceptors(
    FileInterceptor('fileEntity' /** fieldName */), // 上传单个文件
    // FilesInterceptor('multiFileEntities' /** fieldName */), // 上传多个文件
  )
  uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    console.log('[uploadSingleFile] file.fieldname:', file.fieldname); // fileEntity
    console.log('[uploadSingleFile] file.originalname:', file.originalname); // example.jpg
    console.log('[uploadSingleFile] file.mimetype:', file.mimetype); // image/jpeg
    console.log('[uploadSingleFile] file.destination:', file.destination); // /path/to/dist/static
    console.log('[uploadSingleFile] file.filename:', file.filename); // example.[hash8].jpg
    console.log('[uploadSingleFile] file.path:', file.path); // /path/to/dist/static/example.[hash8].jpg
    console.log('[uploadSingleFile] file.size:', file.size); // ? (bytes)
    return '200 OK';
  }

  // 下载
  // http://localhost:3000/upload/example.[hash8].jpg
  @Get(':fnameWithExt')
  download(
    @Param('fnameWithExt') fnameWithExt: string,
    @Res() res: ExpressResponse,
  ) {
    console.log('[download] fnameWithExt:', fnameWithExt);
    const assetUrl = join(__dirname, '../static', fnameWithExt);
    res.download(assetUrl);
  }

  // 流式下载
  // http://localhost:3000/upload/stream/example.[hash8].jpg
  @Get('stream/:fnameWithExt')
  downloadStream(
    @Param('fnameWithExt') fnameWithExt: string,
    @Res() res: ExpressResponse,
  ) {
    console.log('[downloadStream] fnameWithExt:', fnameWithExt);
    const assetUrl = join(__dirname, '../static', fnameWithExt);
    res.setHeader('Content-Type', 'application/octet-stream');
    const fileStream = createReadStream(assetUrl);
    fileStream.pipe(res);
  }
}
