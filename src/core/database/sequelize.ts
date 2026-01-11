import { setting } from '../config/database';
import { settings } from '../config/application';
import { Sequelize } from 'sequelize';
import { Dialect } from 'sequelize';

const { database, username, password, dialect } = settings.environment === 'production'? setting.production: setting.development

export const sequelizeConnection = new Sequelize(
	database as string,
	username,
	password,
	{ dialect: dialect as Dialect }
);
