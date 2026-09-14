export interface IScope {
  _id: string;
  name: string;
  description?: string;
  type: string;
  organizationId: string;
  parentId?: string;
  fields: Record<string, unknown>[];
  permissions: {
    view: string[];
    edit: string[];
    delete: string[];
    create: string[];
  };
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IScopeNode extends IScope {
  children: IScopeNode[];
}

export interface IScopePayload {
  name: string;
  description?: string;
  type: string;
  parentId: string | null; // null = root
  fields: Record<string, unknown>[];
  permissions: {
    view: string[];
    edit: string[];
    delete: string[];
    create: string[];
  };
  config: Record<string, unknown>;
}

export type ConfigRow = { key: string; value: string };
