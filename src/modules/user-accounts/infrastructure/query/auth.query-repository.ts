import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../domain/user.entity';
import { Model } from 'mongoose';
import { MeViewDto } from '../../api/view-dto/users.view-dto';

@Injectable()
export class AuthQueryRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async me(userId: string): Promise<MeViewDto> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException();
    return MeViewDto.mapToView(user);
  }
}
