import { Users } from './users';
import { Roles } from './roles';
import { Permissions } from './permissions';
import { RolePermissions } from './rolePermissions';
import { RefreshTokens } from './refreshTokens';
import logger from '../helpers/logger';

export const defineAssociations = () => {
  
  Users.belongsTo(Roles, {
    foreignKey: 'roleId',
    as: 'role'
  });

  Roles.hasMany(Users, {
    foreignKey: 'roleId',
    as: 'users'
  });

  Users.hasMany(RefreshTokens, {
    foreignKey: 'userId',
    as: 'refreshTokens'
  });

  RefreshTokens.belongsTo(Users, {
    foreignKey: 'userId',
    as: 'user'
  });

  Roles.belongsToMany(Permissions, {
    through: RolePermissions,
    foreignKey: 'roleId',
    otherKey: 'permissionId',
    as: 'permissions'
  });

  Permissions.belongsToMany(Roles, {
    through: RolePermissions,
    foreignKey: 'permissionId',
    otherKey: 'roleId',
    as: 'roles'
  });

  RolePermissions.belongsTo(Roles, {
    foreignKey: 'roleId',
    as: 'role'
  });

  RolePermissions.belongsTo(Permissions, {
    foreignKey: 'permissionId',
    as: 'permission'
  });

  logger.info('Model associations defined successfully');
};
