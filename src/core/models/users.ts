import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelizeConnection } from '../database/sequelize';
import { User } from '../interfaces/models';

export class Users
  extends Model<InferAttributes<Users>, InferCreationAttributes<Users, { omit: 'id' }>>
  implements User
{
  declare id: CreationOptional<number>;

  declare name: string;

  declare email: string;

  declare password: string;

  declare roleId: ForeignKey<number>;
}

Users.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(225),
        allowNull: false
      },
      roleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'roles',
          key: 'id'
        }
      }
    },
    {
      tableName: 'users',
      sequelize: sequelizeConnection
    }
  );
