import bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/UserRepository';
import { RefreshTokenRepository } from '../../repositories/RefreshTokenRepository';
import { assertRefreshTokenIsValid, getRefreshToken, getTokens, getUser, sanitizeUser } from '../../helpers';
import { validateLoginPayload, validateRefreshToken, validateUserId } from '../../helpers/validation';
import logger from '../../helpers/logger';
import { UnauthorizedError } from '../../errors/CustomErrors';

export class AuthService {
    private userRepository: UserRepository;
    private refreshTokenRepository: RefreshTokenRepository;

    constructor(userRepository: UserRepository, refreshTokenRepository: RefreshTokenRepository) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    async login(loginData: { email: string; password: string }) {
        logger.info('User login attempt', { email: loginData.email });

        validateLoginPayload(loginData);
        const { email, password } = loginData;

        const user = await this.userRepository.find({ email });
        if (!user) {
            logger.warn('User login failed - user not found', { email });
            throw new UnauthorizedError('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.warn('User login failed - invalid password', { email });
            throw new UnauthorizedError('Invalid email or password');
        }

        logger.info('User login successful', { 
            userId: user.id, 
            email: user.email 
        });

        const tokens = await getTokens(user);
        return {
            user: sanitizeUser(user),
            tokens
        };
    }

    async refresh(refreshToken: string) {
        logger.info('Refresh token attempt');
        validateRefreshToken(refreshToken);

        const token = await getRefreshToken(refreshToken);
        assertRefreshTokenIsValid(token);
        const user = await getUser(token.userId);

        await this.refreshTokenRepository.update({ token: refreshToken }, { isRevoked: true });

        const tokens = await getTokens(user);

        return tokens
    }

    async logout(refreshToken: string) {
        logger.info('Logout attempt');
        validateRefreshToken(refreshToken);

        const token = await getRefreshToken(refreshToken)
        assertRefreshTokenIsValid(token);

        await this.refreshTokenRepository.update({ token: refreshToken }, { isRevoked: true });
        logger.info('Refresh token revoked', { userId: token.userId });

        return { success: true, message: 'Logout successful' };
    }

    async logoutAll(userId: number) {
        logger.info('Logout all sessions attempt', { userId });
        validateUserId(userId);
        
        await this.refreshTokenRepository.update({ userId }, { isRevoked: true });
        logger.info('All refresh tokens revoked for user', { userId });

        return { success: true, message: 'All sessions logged out' };
    }
}
