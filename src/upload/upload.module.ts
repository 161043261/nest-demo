import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, extname, join } from 'node:path';
import { randomBytes } from 'node:crypto';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../static'),
        filename: (req, file, callback) => {
          console.log('[multer] file.fieldname:', file.fieldname); // fileEntity

          const fnameWithExt = file.originalname;
          console.log('[multer] file.originalname:', fnameWithExt); // example.jpg

          const extWithDot = extname(fnameWithExt);
          console.log('[multer] extWithDot:', extWithDot); // .jpg

          const fnameNoExt = basename(fnameWithExt, extWithDot);
          console.log('[multer] fnameNoExt:', fnameNoExt); // example

          const hash = randomBytes(4).toString('hex').slice(0, 8);

          const renamedFilenameNoExt = `${fnameNoExt}.${hash}${extWithDot}`;
          return callback(null, renamedFilenameNoExt);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
