import { Request, Response } from 'express';
import { ResponseHandlerParams } from '../interfaces/helpers';
import { ServiceFactory } from '../factories/ServiceFactory';

const {createAuthService, createUserService} = ServiceFactory;

export const register = async (req: Request, res: Response): Promise<ResponseHandlerParams> => {
    const userService = createUserService();
    const { name, email, password } = req.body;
    const result = await userService.register({ name, email, password });
    return { status: 201, message: 'Registration successful', data: result };
};

export const login = async (req: Request, res: Response): Promise<ResponseHandlerParams> => {
    const authService = createAuthService();
    const { email, password } = req.body;

    const result = await authService.login({ email, password });
    return { status: 200, message: 'Login successful', data: result };
};

export const refresh = async (req: Request, res: Response): Promise<ResponseHandlerParams> => {
    const authService = createAuthService();
    const { refreshToken } = req.body;

    const tokens = await authService.refresh(refreshToken);
    return {
        status: 200,
        message: 'Token refreshed',
        data: tokens
    };
};

export const logout = async (req: Request, res: Response): Promise<ResponseHandlerParams> => {
    const authService = createAuthService();
    const { refreshToken } = req.body;

    const result = await authService.logout(refreshToken);
    return {
        status: 200,
        message: result.message
    };
};

export const logoutAll = async (req: Request, res: Response): Promise<ResponseHandlerParams> => {
    const authService = createAuthService();
    const userId = res.locals?.userDetails?.id;

    const result = await authService.logoutAll(userId);
    return {
        status: 200,
        message: result.message
    };
};
