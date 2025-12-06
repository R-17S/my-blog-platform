import { IsString, Length, Matches, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 10, { message: 'Login must be between 3 and 10 characters' })
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message: 'Login must contain only letters, numbers, underscores or hyphens',
  })
  login: string;

  @IsString()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
}
