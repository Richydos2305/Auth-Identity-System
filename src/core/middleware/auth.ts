import {verify, Secret} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { settings } from '../config/application';
import { getPermission } from '../helpers/index';
import { RolePermissionRepository } from '../repositories/RolePermissionRepository';
import { RolePermissions } from '../models/rolePermissions';
import logger from '../helpers/logger';
import { ForbiddenError, UnauthorizedError } from '../errors/CustomErrors';

export interface UserPayload {
	userDetails: {
		name: string;
		email: string;
		id: number;
		roleId: number;
	};
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	let token: string | undefined = req.header('Authorization');
    const prefix = 'Bearer ';
	if (!token) {
        throw new UnauthorizedError('Unauthorized');
	} else if (token.startsWith(prefix)) {
        token = token.slice(prefix.length);
		try {
			const payload = verify(token, settings.secretKey as Secret) as UserPayload;

			res.locals = payload;
			next();
		} catch (error) {
            console.error(error)
			next(error);
            throw new UnauthorizedError('Unauthorized');
		}
	}
};

export function authorizePermission(permissionName: string) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = res.locals.userDetails;
			if (!user || !user.roleId) {
				throw new UnauthorizedError('User not authenticated');
			}

			const permission = await getPermission(permissionName);
			const rolePermRepo = new RolePermissionRepository();

			const rolePermissions: RolePermissions[] = await rolePermRepo.findAll(
				{ roleId: user.roleId },
				undefined,
				{ attributes: ['roleId', 'permissionId'] }
			) as RolePermissions[];

			const hasPermission = rolePermissions.some((rp: RolePermissions) => rp.permissionId === permission.id);
			if (!hasPermission) {
				logger.warn(`Access denied: User ${user.name} lacks permission '${permissionName}'`);
				throw new ForbiddenError('You do not have permission to access this resource');
			}
			next();
		} catch (err) {
			next(err);
		}
	};
}
