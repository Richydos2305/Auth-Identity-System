import bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/UserRepository';
import { RefreshTokenRepository } from '../../repositories/RefreshTokenRepository';
import { getTokens } from '../../helpers';
import { validateLoginPayload, validateRefreshToken, validateUserId } from '../../helpers/validation';
import logger from '../../helpers/logger';

export class AuthService {
    private userRepository: UserRepository;
    private refreshTokenRepository: RefreshTokenRepository;

    constructor(userRepository: UserRepository, refreshTokenRepository: RefreshTokenRepository) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    async login(loginData: { email: string; password: string }) {
        try {
            logger.info('User login attempt', { email: loginData.email });

            const { error, value } = validateLoginPayload(loginData);
            if (error) {
                logger.warn('User login validation failed', { 
                    email: loginData.email, 
                    error: error.details[0].message 
                });
                throw new Error(error.details[0].message);
            }

            const { email, password } = value;

            const user = await this.userRepository.find({ email });
            if (!user) {
                logger.warn('User login failed - user not found', { email });
                throw new Error('Invalid email or password');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                logger.warn('User login failed - invalid password', { email });
                throw new Error('Invalid email or password');
            }

            logger.info('User login successful', { 
                userId: user.id, 
                email: user.email 
            });

            const tokens = await getTokens(user);

            const { id, name, email: userEmail, roleId } = user;
            return {
                user: {
                    id,
                    name,
                    email: userEmail,
                    roleId
                },
                tokens
            };
        } catch (error) {
            logger.error('User login error', {
                email: loginData.email,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }

    async refresh(refreshToken: string) {
        try {
            logger.info('Refresh token attempt');
            const { error } = validateRefreshToken(refreshToken);
            if (error) {
                logger.warn('Refresh token validation failed', { error: error.details[0].message });
                throw new Error(error.details[0].message);
            }

            // Find the refresh token in DB
            const token = await this.refreshTokenRepository.find({ token: refreshToken });
            if (!token) {
                logger.warn('Refresh token not found');
                throw new Error('Invalid refresh token');
            }
            if (token.isRevoked) {
                logger.warn('Refresh token revoked', { userId: token.userId });
                throw new Error('Refresh token revoked');
            }
            if (token.expiresAt < new Date()) {
                logger.warn('Refresh token expired', { userId: token.userId });
                throw new Error('Refresh token expired');
            }

            const user = await this.userRepository.find({ id: token.userId });
            if (!user) {
                logger.warn('User for refresh token not found', { userId: token.userId });
                throw new Error('User not found');
            }

            await this.refreshTokenRepository.update({ token: refreshToken }, { isRevoked: true });

            const tokens = await getTokens(user);

            return tokens
        } catch (error) {
            logger.error('Refresh token error', {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }

    async logout(refreshToken: string) {
        try {
            logger.info('Logout attempt');
            const { error } = validateRefreshToken(refreshToken);
            if (error) {
                logger.warn('Refresh token validation failed', { error: error.details[0].message });
                throw new Error(error.details[0].message);
            }

            // Find the refresh token in DB
            const token = await this.refreshTokenRepository.find({ token: refreshToken });
            if (!token) {
                logger.warn('Refresh token not found');
                throw new Error('Invalid refresh token');
            }
            if (token.isRevoked) {
                logger.warn('Refresh token already revoked', { userId: token.userId });
                return { success: true, message: 'Already logged out' };
            }

            await this.refreshTokenRepository.update({ token: refreshToken }, { isRevoked: true });
            logger.info('Refresh token revoked', { userId: token.userId });
            return { success: true, message: 'Logout successful' };
        } catch (error) {
            logger.error('Logout error', {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }

    async logoutAll(userId: number) {
        try {
            logger.info('Logout all sessions attempt', { userId });
            const { error } = validateUserId(userId);
            if (error) {
                logger.warn('Invalid userId for logoutAll', { error: error.details[0].message });
                throw new Error(error.details[0].message);
            }
            
            await this.refreshTokenRepository.update({ userId }, { isRevoked: true });
            logger.info('All refresh tokens revoked for user', { userId });
            return { success: true, message: 'All sessions logged out' };
        } catch (error) {
            logger.error('Logout all error', {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }
}
