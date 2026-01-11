import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelizeConnection } from '../database/sequelize';
import { Permission } from '../interfaces/models';

export class Permissions
  extends Model<InferAttributes<Permissions>, InferCreationAttributes<Permissions, { omit: 'id' }>>
  implements Permission
{
  declare id: CreationOptional<number>;

  declare name: string;

  declare resource: string;

  declare action: string;

  declare description?: string;
}

Permissions.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      resource: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      action: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: 'permissions',
      sequelize: sequelizeConnection,
      indexes: [
        {
          unique: true,
          fields: ['resource', 'action']
        }
      ]
    }
);
