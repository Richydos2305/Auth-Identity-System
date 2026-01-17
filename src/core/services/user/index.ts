import bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/UserRepository';
import { RoleRepository } from '../../repositories/RoleRepository';
import { getAccessToken } from '../../helpers';
import { validateRegisterPayload } from '../../helpers/validation';
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
            logger.error('User register error', {
                email: userData.email,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }
}
