export type Role = 'admin' | 'member';

export interface MemberType {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
}