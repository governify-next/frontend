export enum SystemRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

export type BasicUserInfo = {
  username: string;
  email: string;
  name: string;
  avatar: null; // TODO: define avatar at authenticator
  //systemRole: SystemRole;
  //status: UserStatus;
  //lastLoginAt?: Date;
};
