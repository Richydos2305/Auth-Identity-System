import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelizeConnection } from '../database/sequelize';
import { RolePermission } from '../interfaces/models';

export class RolePermissions
  extends Model<InferAttributes<RolePermissions>, InferCreationAttributes<RolePermissions>>
  implements RolePermission
{
  declare roleId: ForeignKey<number>;

  declare permissionId: ForeignKey<number>;
}

RolePermissions.init(
    {
      roleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'roles',
          key: 'id'
        }
      },
      permissionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'permissions',
          key: 'id'
        }
      }
    },
    {
      tableName: 'role_permissions',
      sequelize: sequelizeConnection
    }
);
