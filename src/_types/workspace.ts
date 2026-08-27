export type WorkspaceType = {
  id: string;
  name: string;
  description: string;
  reference: string;
  owner: string;
  created_by_email: string;
  created_by_user: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};