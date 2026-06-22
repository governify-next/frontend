export interface IOrganization {
  name: string;
  displayName?: string;
  description: string;
}

export interface IMembership {
  userId: {
    _id: string;
    username: string;
  };
  roles: {
    _id: string;
    name: string;
  }[];
}
