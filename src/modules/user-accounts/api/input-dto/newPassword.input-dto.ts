import { IsNotEmpty, IsString, Length } from 'class-validator';
import { passwordConstraints } from '../../domain/user.entity';
import { Trim } from '../../../../core/decorators/transform/trim';

export class NewPasswordDto {
  @IsString()
  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  @Trim()
  newPassword: string;

  @IsString({ message: 'Recovery code must be a string' })
  @IsNotEmpty({ message: 'Recovery code is required' })
  @Trim()
  recoveryCode: string;
}
