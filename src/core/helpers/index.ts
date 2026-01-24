import { Response } from 'express';
import { settings } from '../config/application';
import { sign } from 'jsonwebtoken';
import { Tasks } from '../models/tasks';
import { Users } from '../models/users';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { randomBytes } from 'crypto';
import { SanitizeUserParams, ResponseHandlerParams } from '../interfaces/helpers';
import logger from './logger';
import { RefreshToken } from '../interfaces/models';
import { UserRepository } from '../repositories/UserRepository';
import { RoleRepository } from '../repositories/RoleRepository';
import { NotFoundError, SystemError, UnauthorizedError } from '../errors/CustomErrors';
import { TokenConfig } from '../constants';

export function sanitizeUser(user: Users): SanitizeUserParams {
  const { id, name, email, roleId } = user;
  return { id, name, email, roleId };
}

export function handleError(res: Response, statusCode: number, message: string): void {
  res.status(statusCode).send({ message });
}

export async function getTokens(user: {name: string, email: string, id: number}): Promise<{ accessToken: string, refreshToken: string, expiresIn: number }> {
  const accessToken = sign(
    {
      userDetails: {
        name: user.name,
        email: user.email,
        id: user.id
      }
    },
    settings.secretKey,
    { expiresIn: TokenConfig.AccessTokenExpiry }
  );

  const refreshToken = randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + TokenConfig.RefreshTokenExpiryMs);

  const refreshTokenRepository = new RefreshTokenRepository();
  await refreshTokenRepository.create({
    userId: user.id,
    token: refreshToken,
    expiresAt,
    isRevoked: false
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: TokenConfig.AccessTokenExpirySeconds
  };
}

export function isAuthorizedUser(task: Tasks, loggedInUserId: number ): boolean {
  if (task.user_id === loggedInUserId)
    return true
  return false
}

export async function getUser(id: number) {
  const userRepository = new UserRepository();
  const user = await userRepository.find({ id });
  if (!user) {
      logger.warn('User not found', { id });
      throw new NotFoundError('User not found');
  }
  return user;
}

export async function getDefaultUserRole() {
  const roleRepository = new RoleRepository();
  const defaultRole = await roleRepository.find({ name: 'USER' });

  if (!defaultRole) {
      logger.error('Default USER role not found in database');
      throw new SystemError('System configuration error. Please contact administrator.');
  }
  return defaultRole;
} 

export async function getRefreshToken(token: string) {
  const refreshTokenRepository = new RefreshTokenRepository();
  const refreshToken = await refreshTokenRepository.find({ token });
  if (!refreshToken) {
      logger.warn('Refresh token not found', { token });
      throw new UnauthorizedError('Invalid refresh token');
  }
  return refreshToken;
}

export function assertRefreshTokenIsValid(refreshToken: RefreshToken) {
    if (refreshToken.isRevoked) {
        logger.warn('Refresh token revoked', { userId: refreshToken.userId });
        throw new UnauthorizedError('Refresh token already revoked');
    }
    if (refreshToken.expiresAt < new Date()) {
        logger.warn('Refresh token expired', { userId: refreshToken.userId });
        throw new UnauthorizedError('Refresh token expired');
    }
}

export function responseHandler(res: Response, result: ResponseHandlerParams ) {
  const { status = 200, message = 'Success', data = {} } = result;
  res.status(status).json({ success: true, message, data });
}
