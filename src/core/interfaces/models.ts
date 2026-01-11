export interface User {
    name: string;
    email: string;
    password: string;
    roleId?: number;
  }

export interface Role {
    id: number;
    name: string;
    description: string;
}

export interface Permission {
    id: number;
    name: string;
    resource: string;
    action: string;
    description?: string;
}

export interface RolePermission {
    roleId: number;
    permissionId: number;
}

export interface RefreshToken {
    id: number;
    userId: number;
    token: string;
    expiresAt: Date;
    isRevoked: boolean;
}

export interface Task {
    title: string;
    description: string;
    user_id: number;
}
