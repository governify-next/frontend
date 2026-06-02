export enum SystemRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

export interface BasicUserInfo {
  username: string;
  email: string;
  name: string;
  avatar: null; // TODO: define avatar at authenticator
}

export interface UserInfo extends BasicUserInfo {
  _id: string;
  systemRole: SystemRole;
  status: UserStatus;
  lastLoginAt?: Date;
}

// User payload for user table

export type UserPayload = Partial<Pick<UserInfo, "status" | "systemRole">>;
