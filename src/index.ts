import { sequelizeConnection } from './core/database/sequelize';
import { defineAssociations } from './core/models/associations';
import express from 'express';
import { settings } from './core/config/application';
import routes from './core/routes';
import errorHandler from './core/middleware/errorhandler';
import logger from './core/helpers/logger';

const app = express();
const port = settings.port || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

app.use(errorHandler);

defineAssociations();

app.listen(port, () => {
	logger.info(`Server running on Port ${port}`);
});

sequelizeConnection.authenticate().then(() => {
	logger.info(`Connected to ${sequelizeConnection.getDatabaseName()} Database`);
}).catch((error) => {
	logger.error('Database connection failed', { error: error.message });
});
