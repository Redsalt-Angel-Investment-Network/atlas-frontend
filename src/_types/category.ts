export type CategorySchemaFieldType = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  position: number;
};

export type CreateCategorySchemaFieldType = {
  name: string;
  type: string;
  required: boolean;
  position: number;
};

export type CategorySchemaType = {
  id: string;
  version: number;
  fields: CategorySchemaFieldType[];
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

export type CreateCategoryPayload = {
  name: string;
  description?: string;
  is_active: boolean;
  schema: CreateCategorySchemaFieldType[];
};

export type UpdateCategoryPayload = {
  name: string;
  description?: string;
  is_active: boolean;
  schema: CreateCategorySchemaFieldType[];
};