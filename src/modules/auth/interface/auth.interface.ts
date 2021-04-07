import { IUserGroup } from '../../users/interface/user.interface';

export interface IJwtPayload {
  uid: number;
  name: string;
  group: IUserGroup;
}
