export interface EntityCategory {
  id: string;
  name: string;
}
export interface EntitySchema {
  id: string;
  name: string;
}

export interface EntitySchemaField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  position: number;
}

export interface EntityCategorySchema {
  id: string;
  category_id: string;
  version: number;
  fields: EntitySchemaField[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export interface EntityWorkspace {
  id: string;
  name: string;
}
export interface EntityAttribute {
  id?: string;
  field_id: string;
  field_name: string;
  value: EntityAttributeValue;
}
export interface Entity {
  id: string;
  workspace_id: string;
  category_id: string;
  category_schema_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  reference: string;
  attributes: EntityAttribute[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateEntityAttributePayload {
  field_id: string;
  value: EntityAttributeValue;
}

export interface CreateEntityPayload {
  category_id: string;
  category_schema_id: string;
  name: string;
  attributes: CreateEntityAttributePayload[];
}

export interface EntityAttributeType {
  id: string;
  field_id: string;
  field_name: string;
  value: EntityAttributeValue;
}

export interface EntityRead {
  id: string;
  workspace_id: string;
  category_id: string;
  category_schema_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  reference: string;
  attributes: EntityAttributeType[];
  created_at: string;
  updated_at: string;
}
export interface EntitySummary { 
  id: string; 
  workspace_id: string; 
  category_id: string; 
  category_schema_id: string; 
  name: string; 
  reference: string; 
  attributes_preview: Record<string, EntityAttributeValue>;
  status: "active" | "archived"; 
  created_at: string;
  updated_at: string; }

export type EntityAttributeValue = string | number | boolean | null |undefined | Record<string, unknown> ;

// For detail view with full data
export interface EntityDetail extends Entity {
  description?: string;
  relationships: EntityRelationship[];
}

export interface EntityRelationship {
  id: string;
  type: string;
  source_id: string;
  target_id: string;
  target_name: string;
  target_category: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface EntityFilterState {
  category: string;
  status: string;
  sortBy: string;
  search?: string;
}

export interface EntityListResponse {
  items: EntitySummary[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface UpdateEntityAttributePayload {
  field_id: string;
  value: EntityAttributeValue;
}

export interface UpdateEntityPayload {
  name?: string;
  attributes?: UpdateEntityAttributePayload[];
}