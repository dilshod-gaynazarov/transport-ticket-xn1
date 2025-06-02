import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFile } from 'fs';
import { extname, join, resolve } from 'path';
import config from 'src/config';
import { handleError } from 'src/helpers/error-handle';
import { v4 } from 'uuid';

@Injectable()
export class FileService {
  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const ext = extname(file.originalname);
      const fileName = `${file.originalname.split('.')[0]}_${v4()}${ext.toLowerCase()}`;
      const filePath = resolve(__dirname, '..', '..', '..', 'upload');
      if (!existsSync(filePath)) {
        mkdirSync(filePath, { recursive: true });
      }
      new Promise((res, rej) => {
        writeFile(join(filePath, fileName), file.buffer, (err) => {
          if (err) rej(err);
          resolve();
        });
      });
      return `${config.BASE_URL}/${fileName}`;
    } catch (error) {
      return handleError(error);
    }
  }
}
