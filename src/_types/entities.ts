export interface EntityCategory {
  id: string;
  name: string;
}
export interface EntitySchema {
  id: string;
  name: string;
}
export interface EntityWorkspace {
  id: string;
  name: string;
}
export interface EntityAttribute {
  id?: string;
  field: string;
  value: string | number | boolean | null | Record<string, unknown>;
}
export interface Entity {
  id: string;
  workspace_id: string;
  category_id: string;
  category_schema_id: string;
  name: string;
  reference: string;
  attributes: EntityAttribute[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// For list views
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

export type EntityAttributeValue = string | number | boolean | null;

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