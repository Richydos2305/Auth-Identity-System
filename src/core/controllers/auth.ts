import { Request, Response } from 'express';
import { UserService } from '../services/user';
import { UserRepository } from '../repositories/UserRepository';
import { RoleRepository } from '../repositories/RoleRepository';


export const register = async (req: Request, res: Response) => {
    const userRepository = new UserRepository();
    const roleRepository = new RoleRepository();
    const userService = new UserService(userRepository, roleRepository);
    const { name, email, password } = req.body;
    
    try {
        const result = await userService.register({ name, email, password });
        
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Registration failed'
        });
    }
};

export const login = async (req: Request, res: Response) => {
    // To be implemented
    res.json({ message: 'Login endpoint - to be implemented' });
};

export const refresh = async (req: Request, res: Response) => {
    // To be implemented
    res.json({ message: 'Refresh token endpoint - to be implemented' });
};

export const logout = async (req: Request, res: Response) => {
    // To be implemented
    res.json({ message: 'Logout endpoint - to be implemented' });
};

export const profile = async (req: Request, res: Response) => {
    // To be implemented
    res.json({ message: 'Profile endpoint - to be implemented' });
};
