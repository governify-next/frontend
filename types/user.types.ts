export enum SystemRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

export interface IBasicUserInfo {
  username: string;
  email: string;
  name: string;
  systemRole: SystemRole;
  avatar: null; // TODO: define avatar at authenticator
}

export interface IUserInfo extends IBasicUserInfo {
  _id: string;
  surname: string;
  status: UserStatus;
  lastLoginAt?: Date;
}

// User payload for user table

export type IUserPayload = Partial<
  Pick<IUserInfo, "status" | "systemRole" | "name" | "surname" | "email"> & {
    password?: string;
  }
>;

export type ICreateIUserPayload = Pick<
  IUserInfo,
  "username" | "name" | "surname" | "email" | "systemRole" | "status"
> & { password: string };

export type UserSearchFilters = {
  usernameOrEmail?: string;
  username?: string;
  email?: string;
  status?: UserStatus;
  systemRole?: SystemRole;
};
