export const Permissions = {
  CanViewUsers: 'can_view_users',
  CanCreateUsers: 'can_create_users',
  CanUpdateUsers: 'can_update_users',
  CanDeleteUsers: 'can_delete_users',
  CanManageRoles: 'can_manage_roles',
  CanManagePermissions: 'can_manage_permissions',
} as const;

export type Permission = typeof Permissions[keyof typeof Permissions];
