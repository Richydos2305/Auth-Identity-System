import { UserService } from '../services/user';
import { AuthService } from '../services/auth';
import { UserRepository } from '../repositories/UserRepository';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';

export class ServiceFactory {
    static createUserService(): UserService {
        const userRepository = new UserRepository();
        return new UserService(userRepository);
    }

    static createAuthService(): AuthService {
        const userRepository = new UserRepository();
        const refreshTokenRepository = new RefreshTokenRepository();
        return new AuthService(userRepository, refreshTokenRepository);
    }
}
