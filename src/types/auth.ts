// Role-based access control types with multi-tenant support

export type UserRole = 'super_admin' | 'tenant_admin' | 'analyst' | 'viewer' | 'external' | 'developer';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  type: 'enterprise' | 'agency' | 'brand' | 'partner';
  plan: 'starter' | 'professional' | 'enterprise' | 'custom';
  settings: TenantSettings;
  dataResidency: 'us' | 'eu' | 'apac' | 'custom';
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface TenantSettings {
  branding?: {
    primaryColor?: string;
    logo?: string;
    favicon?: string;
  };
  features: {
    maxUsers: number;
    maxDataSources: number;
    maxStorageGB: number;
    customConnectors: boolean;
    apiAccess: boolean;
    mcpEnabled: boolean;
    ssoEnabled: boolean;
    auditLog: boolean;
    dataRetentionDays: number;
  };
  security: {
    ipWhitelist?: string[];
    mfaRequired: boolean;
    sessionTimeoutMinutes: number;
    passwordPolicy: 'basic' | 'strong' | 'custom';
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  tenants: TenantMembership[]; // User can belong to multiple tenants
  role: UserRole; // Global role
  permissions: Permission[];
  dataSourceAccess: DataSourceAccess[];
  createdAt: Date;
  lastActive: Date;
}

export interface TenantMembership {
  tenantId: string;
  tenantName: string;
  role: UserRole;
  permissions: Permission[];
  joinedAt: Date;
  isDefault: boolean;
}

export interface Permission {
  resource: string;
  actions: Action[];
}

export type Action = 'read' | 'write' | 'delete' | 'execute' | 'configure';

export interface DataSourceAccess {
  sourceId: string;
  sourceName: string;
  tenantId: string; // Tenant-specific data source
  accessLevel: 'full' | 'read' | 'restricted';
  allowedOperations: string[];
  dataFilters?: Record<string, any>;
  sharedWith?: string[]; // Tenant IDs this source is shared with
}

export interface RolePermissions {
  super_admin: {
    description: 'System-wide administration';
    permissions: [
      'system:*',
      'tenants:*',
      'connectors:*',
      'extraction:*',
      'analysis:*',
      'users:*',
      'settings:*'
    ];
  };
  tenant_admin: {
    description: 'Tenant-level administration';
    permissions: [
      'tenant:manage',
      'connectors:*:tenant',
      'extraction:*:tenant',
      'analysis:*:tenant',
      'users:*:tenant',
      'settings:*:tenant'
    ];
  };
  admin: {
    description: 'Full tenant access';
    permissions: [
      'connectors:*:owned',
      'extraction:*:owned',
      'analysis:*:owned',
      'users:read:tenant',
      'settings:read:tenant'
    ];
  };
  analyst: {
    description: 'Create and run analyses';
    permissions: [
      'connectors:read',
      'extraction:execute',
      'analysis:*',
      'reports:write'
    ];
  };
  viewer: {
    description: 'View reports and dashboards';
    permissions: [
      'connectors:read',
      'analysis:read',
      'reports:read',
      'dashboards:read'
    ];
  };
  external: {
    description: 'Limited external partner access';
    permissions: [
      'connectors:read:assigned',
      'analysis:read:shared',
      'reports:read:shared'
    ];
  };
  developer: {
    description: 'API and integration access';
    permissions: [
      'connectors:*',
      'api:*',
      'mcp:configure',
      'webhooks:*'
    ];
  };
}

export interface AuthContext {
  user: User | null;
  currentTenant: Tenant | null;
  isAuthenticated: boolean;
  hasPermission: (permission: string, tenantId?: string) => boolean;
  hasDataSourceAccess: (sourceId: string, operation: string, tenantId?: string) => boolean;
  canAccessConnector: (connectorType: string, tenantId?: string) => boolean;
  switchTenant: (tenantId: string) => Promise<void>;
  getTenantSettings: () => TenantSettings | null;
}

// Tenant isolation strategies
export interface TenantIsolation {
  database: 'shared' | 'schema' | 'dedicated'; // How data is isolated
  storage: 'shared' | 'bucket' | 'dedicated';   // How files are isolated
  compute: 'shared' | 'isolated' | 'dedicated'; // How processing is isolated
}

// Cross-tenant sharing
export interface DataShareRequest {
  id: string;
  fromTenantId: string;
  toTenantId: string;
  resourceType: 'connector' | 'dataset' | 'analysis' | 'report';
  resourceId: string;
  permissions: Permission[];
  expiresAt?: Date;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  approvedBy?: string;
  approvedAt?: Date;
}