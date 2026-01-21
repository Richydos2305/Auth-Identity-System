import { Request, Response } from 'express';
import { UserService } from '../services/user';
import { AuthService } from '../services/auth';
import { UserRepository } from '../repositories/UserRepository';
import { RoleRepository } from '../repositories/RoleRepository';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';


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
    const userRepository = new UserRepository();
    const refreshTokenRepository = new RefreshTokenRepository();
    const authService = new AuthService(userRepository, refreshTokenRepository);
    const { email, password } = req.body;

    try {
        const result = await authService.login({ email, password });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: result.user,
                tokens: result.tokens
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : 'Login failed'
        });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const userRepository = new UserRepository();
    const refreshTokenRepository = new RefreshTokenRepository();
    const authService = new AuthService(userRepository, refreshTokenRepository);
    const { refreshToken } = req.body;

    try {
        const tokens = await authService.refresh(refreshToken);
        res.status(200).json({
            success: true,
            message: 'Token refreshed',
            data: {
                tokens
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : 'Token refresh failed'
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    const userRepository = new UserRepository();
    const refreshTokenRepository = new RefreshTokenRepository();
    const authService = new AuthService(userRepository, refreshTokenRepository);
    const { refreshToken } = req.body;

    try {
        const result = await authService.logout(refreshToken);
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Logout failed'
        });
    }
};

export const logoutAll = async (req: Request, res: Response) => {
    const userRepository = new UserRepository();
    const refreshTokenRepository = new RefreshTokenRepository();
    const authService = new AuthService(userRepository, refreshTokenRepository);
    const userId = res.locals?.userDetails?.id;

    try {
        const result = await authService.logoutAll(userId);
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Logout all failed'
        });
    }
};

export const profile = async (req: Request, res: Response) => {
    const userRepository = new UserRepository();
    const roleRepository = new RoleRepository();
    const userService = new UserService(userRepository, roleRepository);
    const userId = res.locals?.userDetails?.id;

    try {
        const userProfile = await userService.getUserProfile(userId);
        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: userProfile
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'User not found') {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        } else {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch profile'
            });
        }
    }
};
