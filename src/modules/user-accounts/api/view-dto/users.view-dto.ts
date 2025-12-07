import { UserDocument } from '../../domain/user.entity';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';

export class UserViewModel {
  id: string;
  login: string;
  email: string;
  createdAt: Date;

  static mapToView(user: UserDocument): UserViewModel {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

export class UsersViewPaginated extends PaginatedViewDto<UserViewModel[]> {
  items: UserViewModel[];
}
