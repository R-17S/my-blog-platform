import { IsEmail } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';

export class EmailResendingDto {
  @IsEmail({}, { message: 'Email must be valid' })
  @Trim()
  email: string;
}
