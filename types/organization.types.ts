export interface IOrganization {
  name: string;
  displayName?: string;
  description: string;
  roles: IRole[];
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
  };
  roles: IRole[];
}

export interface IRole {
  _id: string;
  name: string;
  description: string;
}

export type IRolePayload = Pick<IRole, "name" | "description">;
