export enum SystemRole {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

export interface IBasicUserInfo {
  _id: string;
  username: string;
  email: string;
  name: string;
  systemRole: SystemRole;
  avatar: null; // TODO: define avatar at authenticator
}

export interface IUserInfo extends IBasicUserInfo {
  surname: string;
  status: UserStatus;
  lastLoginAt?: Date;
  createdBy?: string;
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
