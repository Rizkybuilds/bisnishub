export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  authUserId?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'INVITED';

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  roleId: string;
  status: MemberStatus;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface SessionContext {
  user: {
    id: string;
    authUserId: string;
    name: string;
    email: string;
  };
  organization: {
    id: string;
    code: string;
    displayName: string;
  };
  role: {
    code: string;
    name: string;
  };
  activeBrand: {
    code: string;
    name: string;
  };
}
