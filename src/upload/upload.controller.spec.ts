import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

describe('UploadController', () => {
  let controller: UploadController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MulterModule.register({
          storage: diskStorage({
            destination: './uploads',
            filename: (_req, file, cb) => {
              const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
              const extension = '.txt';
              cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
            },
          }),
        }),
      ],
      controllers: [UploadController],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  describe('uploadFile', () => {
    it('should upload a file and return the filename', async () => {
      const result = await controller.uploadFile({
        fieldname: 'file',
        originalname: 'test.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 4,
        destination: join(__dirname, '..', 'uploads'),
        filename: 'file-123.txt',
        path: join(__dirname, '..', 'uploads', 'file-123.txt'),
      });

      expect(result).toMatchObject({ filename: 'file-123.txt' });
    });
  });
});
