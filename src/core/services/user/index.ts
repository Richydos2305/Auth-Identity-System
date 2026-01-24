import bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/UserRepository';
import { validateRegisterPayload, validateUserId } from '../../helpers/validation';
import logger from '../../helpers/logger';
import { getDefaultUserRole, getTokens, getUser, sanitizeUser } from '../../helpers';
import { ConflictError } from '../../errors/CustomErrors';
import { TokenConfig } from '../../constants';

export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async register(userData: { name: string; email: string; password: string }) {
        logger.info('User register attempt', { email: userData.email });

        validateRegisterPayload(userData);
        const { name, email, password } = userData;

        const userExists = await this.userRepository.find({ email });
        if (userExists) {
            logger.warn('User register failed - user already exists', { email });
            throw new ConflictError('User Already Exists. Login Instead');
        }

        const hashedPassword = await bcrypt.hash(password, TokenConfig.BcryptRounds);
        const defaultRole = await getDefaultUserRole();
        
        const user = await this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            roleId: defaultRole.id
        });

        logger.info('User registration successful', { 
            userId: user.id, 
            email: user.email 
        });

        const tokens = await getTokens(user);
        return { user: sanitizeUser(user), tokens };
    }

    async getUserProfile(userId: number) {
        logger.info('Get user profile attempt', { userId });
        
        validateUserId(userId);

        const user = await getUser(userId);

        logger.info('User profile retrieved successfully', { userId });
        return sanitizeUser(user);
    }
}
