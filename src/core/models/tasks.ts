import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelizeConnection } from '../database/sequelize';
import { Task } from '../interfaces/models';
import { Users } from './users';

export class Tasks
  extends Model<InferAttributes<Tasks>, InferCreationAttributes<Tasks, { omit: 'id' }>>
  implements Task
{
  declare id: CreationOptional<number>;

  declare user_id: ForeignKey<number>;

  declare title: string;

  declare description: string;
}

Tasks.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: Users,
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(225)
      },
    },
    {
      tableName: 'tasks',
      sequelize: sequelizeConnection
    }
  );
