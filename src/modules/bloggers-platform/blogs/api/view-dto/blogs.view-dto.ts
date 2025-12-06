import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { BlogDocument } from '../../domain/blog.entity';

export class BlogViewModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
  // а что делать то? взвращается lean  как это типизировать ?
  static mapToView(blog: BlogDocument): BlogViewModel {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }
}

export class BlogsViewPaginated extends PaginatedViewDto<BlogViewModel[]> {
  items: BlogViewModel[];
}
