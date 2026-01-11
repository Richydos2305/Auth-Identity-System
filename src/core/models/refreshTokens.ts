import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelizeConnection } from '../database/sequelize';
import { RefreshToken } from '../interfaces/models';

export class RefreshTokens
  extends Model<InferAttributes<RefreshTokens>, InferCreationAttributes<RefreshTokens, { omit: 'id' }>>
  implements RefreshToken
{
  declare id: CreationOptional<number>;

  declare userId: ForeignKey<number>;

  declare token: string;

  declare expiresAt: Date;

  declare isRevoked: boolean;
}

RefreshTokens.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      token: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      isRevoked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      tableName: 'refresh_tokens',
      sequelize: sequelizeConnection,
      indexes: [
        {
          fields: ['token']
        },
        {
          fields: ['userId']
        }
      ]
    }
);
