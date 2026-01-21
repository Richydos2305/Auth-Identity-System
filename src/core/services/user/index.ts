import bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/UserRepository';
import { RoleRepository } from '../../repositories/RoleRepository';
import { validateRegisterPayload, validateUserId } from '../../helpers/validation';
import logger from '../../helpers/logger';

export class UserService {
    private userRepository: UserRepository;
    private roleRepository: RoleRepository;

    constructor(userRepository: UserRepository, roleRepository: RoleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    async register(userData: { name: string; email: string; password: string }) {
        try {
            logger.info('User register attempt', { email: userData.email });

            const { error, value } = validateRegisterPayload(userData);
            if (error) {
                logger.warn('User register validation failed', { 
                    email: userData.email, 
                    error: error.details[0].message 
                });
                throw new Error(error.details[0].message);
            }

            const { name, email, password } = value;

            const userExists = await this.userRepository.find({ email });
            if (userExists) {
                logger.warn('User register failed - user already exists', { email });
                throw new Error('User Already Exists. Login Instead');
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const defaultRole = await this.roleRepository.getDefaultUserRole();
            if (!defaultRole) {
                logger.error('Default USER role not found in database');
                throw new Error('System configuration error. Please contact administrator.');
            }
            
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

        } catch (error) {
            logger.error('User registration error', {
                email: userData.email,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }

    async getUserProfile(userId: number) {
        try {
            logger.info('Get user profile attempt', { userId });
            
            const { error } = validateUserId(userId);
            if (error) {
                logger.warn('Invalid userId for getUserProfile', { error: error.details[0].message });
                throw new Error(error.details[0].message);
            }

            const user = await this.userRepository.find({ id: userId });
            if (!user) {
                logger.warn('User profile not found', { userId });
                throw new Error('User not found');
            }

            const { id, name, email, roleId } = user;
            logger.info('User profile retrieved successfully', { userId });
            return { id, name, email, roleId };
        } catch (error) {
            logger.error('Get user profile error', {
                userId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }
}
