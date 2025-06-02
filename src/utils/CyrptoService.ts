import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class CryptoService {
  async encrypt(data: string): Promise<string> {
    return hash(data, 7);
  }

  async decrypt(data: string, hashedData: string): Promise<boolean> {
    return compare(data, hashedData);
  }
}
