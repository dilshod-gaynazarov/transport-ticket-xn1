import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { extname } from 'path';
import { handleError } from 'src/helpers/error-handle';

@Injectable()
export class ImageValiationPipe implements PipeTransform {
  private readonly fileExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      if (value) {
        const ext = extname(value.originalname).toLowerCase();
        if (!this.fileExtensions.includes(ext)) {
          throw new BadRequestException(
            `Only allowed files: ${this.fileExtensions.join(', ')}`,
          );
        }
      }
      return value;
    } catch (error) {
      return handleError(error);
    }
  }
}
