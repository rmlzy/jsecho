import { IUserGroup } from "@/modules/users/interface/user.interface";

export interface IJwtPayload {
  uid: number;
  name: string;
  group: IUserGroup;
}
