import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../domain/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async save(post: UserDocument): Promise<void> {
    await post.save();
  }

  async findById(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.userModel.findOne({
      _id: new Types.ObjectId(id),
      deletedAt: null,
    });
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ login });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async exists(id: string): Promise<boolean> {
    return !!(await this.userModel.exists({ _id: new Types.ObjectId(id) }));
  }

  async deleteAll(): Promise<void> {
    await this.userModel.deleteMany({});
  }
}
