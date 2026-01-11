import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelizeConnection } from '../database/sequelize';
import { Role } from '../interfaces/models';

export class Roles
  extends Model<InferAttributes<Roles>, InferCreationAttributes<Roles, { omit: 'id' }>>
  implements Role
{
  declare id: CreationOptional<number>;

  declare name: string;

  declare description: string;
}

Roles.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    },
    {
      tableName: 'roles',
      sequelize: sequelizeConnection
    }
);
