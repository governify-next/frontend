export interface IOrganization {
  name: string;
  displayName?: string;
  description: string;
  roles: (IRole & { members: number })[];
  members: number;
  scopes: number;
  createdBy: string;
}

export type IOrganizationPayload = Pick<
  IOrganization,
  "name" | "description" | "displayName"
>;

export interface IMembership {
  userId: {
    _id: string;
    username: string;
    name: string;
    surname: string;
    email: string;
  };
  roles: IRole[];
}

export type IMembershipPayload = Pick<IMembership["userId"], "username">;

export interface IRole {
  _id: string;
  name: string;
  description: string;
  color: string;
}

export type IRolePayload = Pick<IRole, "name" | "description" | "color">;

export interface IOrganizationSearchFilters {
  nameOrDisplayName?: string;
}
