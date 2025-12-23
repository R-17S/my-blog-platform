import { IsEmail } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';

export class PasswordRecoveryDto {
  @IsEmail({}, { message: 'Email must be valid' })
  @Trim()
  email: string;
}
