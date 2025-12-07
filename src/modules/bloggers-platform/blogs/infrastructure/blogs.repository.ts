import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Blog, BlogDocument } from '../domain/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}

  async save(blog: BlogDocument): Promise<void> {
    await blog.save();
  }

  async findById(id: string): Promise<BlogDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.blogModel.findOne({
      _id: new Types.ObjectId(id),
      deletedAt: null,
    });
  }

  async getBlogNameOrError(id: string): Promise<string> {
    const blog = await this.blogModel
      .findById(id, { name: 1 })
      .lean<{ name: string }>();
    if (!blog) throw new NotFoundException('Blog not found');
    return blog.name;
  }

  async exists(id: string): Promise<boolean> {
    return !!(await this.blogModel.exists({ _id: new Types.ObjectId(id) }));
  }

  async deleteAll(): Promise<void> {
    await this.blogModel.deleteMany({});
  }
}
