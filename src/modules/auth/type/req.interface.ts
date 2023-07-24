import { Users } from '../../../modules/users/entities/user.entity';

export interface RequestUser extends Request {
  user: Users;
}
