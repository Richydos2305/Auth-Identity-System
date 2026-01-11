import { Response } from 'express';
import { settings } from '../config/application';
import { sign } from 'jsonwebtoken';
import { Tasks } from '../models/tasks';
import { Users } from '../models/users';

export function handleError(res: Response, statusCode: number, message: string): void {
  res.status(statusCode).send({ message });
}

export function getAccessToken(user: {name: string, email: string, id: number}): string {

  const accessToken = sign(
    {
      userDetails: {
        name: user.name,
        email: user.email,
        id: user.id
      }
    },
    settings.secretKey,
    { expiresIn: '4h' }
  );
  return accessToken
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
