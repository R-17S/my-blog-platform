import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArgonService {
  async generateHash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
