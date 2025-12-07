import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BlogsViewPaginated,
  BlogViewModel,
} from '../../api/view-dto/blogs.view-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../domain/blog.entity';
import { Model } from 'mongoose';
import { BlogInputQuery } from '../../api/input-dto/get-blogs-query-params.input-dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}

  async getAllBlogs(params: BlogInputQuery): Promise<BlogsViewPaginated> {
    const filter = params.searchNameTerm
      ? { name: { $regex: params.searchNameTerm, $options: 'i' } }
      : {};

    const [totalCount, blogs] = await Promise.all([
      this.blogModel.countDocuments(filter),
      this.blogModel
        .find(filter)
        .sort(params.SortOptions(params.sortBy))
        .skip(params.calculateSkip())
        .limit(params.pageSize)
        .lean(),
    ]);

    return BlogsViewPaginated.mapToView({
      items: blogs.map((blog) => BlogViewModel.mapToView(blog)),
      // каждый документ мапится BlogViewModel, а как сделать другую сложность
      //blogs.map(BlogViewModel.mapToView) почему не работает вот так ?
      page: params.pageNumber,
      size: params.pageSize,
      totalCount,
    });
  }

  async getBlogByIdOrError(id: string): Promise<BlogViewModel> {
    const result = await this.blogModel
      .findOne({ _id: id, deletedAt: null }) // фильтруем только "живые" блоги
      .lean();

    if (!result) throw new NotFoundException('Blog not found');
    return BlogViewModel.mapToView(result);
  }
}
