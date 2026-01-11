import { Request, Response} from 'express';
import { handleError } from '../helpers';
import { UserService } from '../services/user';
import { UserRepository } from '../repositories/UserRepository';

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const userService = new UserService(new UserRepository());
        const result = await userService.signup(req.body);
        
        res.status(201).send({ token: result.token });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('mandatory') || 
            errorMessage.includes('already exists') || 
            errorMessage.includes('required') ||
            errorMessage.includes('valid email')) {
            return handleError(res, 400, errorMessage);
        }
        
        return handleError(res, 500, 'Internal server error');
    }
}