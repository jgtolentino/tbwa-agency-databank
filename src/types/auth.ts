export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  permissions: string[];
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  defaultWorkspaceId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  settings: TenantSettings;
}

export interface TenantMembership {
  id: string;
  tenantId: string;
  userId: string;
  role: 'admin' | 'member' | 'viewer';
  permissions: string[];
}

export interface TenantSettings {
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
  };
  features: {
    [key: string]: boolean;
  };
}