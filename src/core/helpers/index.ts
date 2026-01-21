import { Response } from 'express';
import { settings } from '../config/application';
import { sign } from 'jsonwebtoken';
import { Tasks } from '../models/tasks';
import { Users } from '../models/users';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { randomBytes } from 'crypto';

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
    { expiresIn: '15m' }
  );

  const refreshToken = randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

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
    expiresIn: 15 * 60
  };
}

export function isAuthorizedUser(task: Tasks, loggedInUserId: number ): boolean {
  if (task.user_id === loggedInUserId)
    return true
  return false
}
export async function userExists(loggedInUserId: number ): Promise<boolean> {
  const loggedInUser = await Users.findOne({ where: { id:loggedInUserId } })
  if (loggedInUser)
    return true
  return false
}
