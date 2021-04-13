import { IUserGroup } from "@/modules/user/user.interface";

export interface IJwtPayload {
  uid: number;
  name: string;
  group: IUserGroup;
}
