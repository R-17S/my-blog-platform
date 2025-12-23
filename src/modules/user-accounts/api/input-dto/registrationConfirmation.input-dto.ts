import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';

export class RegistrationConfirmationDto {
  @IsString({ message: 'Recovery code must be a string' })
  @IsNotEmpty({ message: 'Recovery code is required' })
  @Trim()
  code: string;
}
