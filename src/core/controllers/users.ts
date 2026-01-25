import { Request, Response } from 'express';
import { ResponseHandlerParams } from '../interfaces/helpers';
import { ServiceFactory } from '../factories/ServiceFactory';

const { createUserService } = ServiceFactory;

export const getProfile = async (req: Request, res: Response): Promise<ResponseHandlerParams> => {
    const userService = createUserService();
    const userId = res.locals?.userDetails?.id;

    const userProfile = await userService.getUserProfile(userId);
    return {
        status: 200,
        message: 'Profile retrieved successfully',
        data: userProfile
    };
};
