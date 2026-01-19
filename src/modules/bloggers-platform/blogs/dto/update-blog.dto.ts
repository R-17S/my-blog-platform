import { Matches } from 'class-validator';
import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';

export class UpdateBlogDto {
  @IsStringWithTrim(1, 15)
  name: string;

  @IsStringWithTrim(1, 500)
  description: string;

  @IsStringWithTrim(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    {
      message: 'WebsiteUrl must be a valid URL',
    },
  )
  websiteUrl: string;
}
