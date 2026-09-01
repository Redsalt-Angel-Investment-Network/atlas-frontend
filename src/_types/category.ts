export type CategorySchemaFieldsType = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  position: number;
  definition: Record<string, any>;
};

export type CategorySchemaType = {
  version: number;
  fields: CategorySchemaFieldsType[];
};

export type CategoryType = {
  id: string;
  workspace_id: string;
  name: string;
  slug: string;
  reference: string;
  description: string;
  is_active: boolean;
  schema: CategorySchemaType;
  created_at: string;
  updated_at: string;
};
