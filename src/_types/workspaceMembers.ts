import { Role } from "./members";


export type WorkspaceMemberType = {
  id: string;
  name: string;
  email: string;
  role: Role;
  workspace_id: string;
  workspace_name: string;
  is_current: boolean;
  is_deleted: boolean;
  created_at: string;
};