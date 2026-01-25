import { Request, Response } from 'express';
import { ResponseHandlerParams } from '../interfaces/helpers';
import { ServiceFactory } from '../factories/ServiceFactory';

const { createUserService } = ServiceFactory;

export const getUsers = async (req: Request, res: Response): Promise<ResponseHandlerParams> => {
    const userService = createUserService();
    const page = parseInt(req.query?.page as string) || 1;
    const limit = parseInt(req.query?.limit as string) || 20;
    const search = (req.query?.search as string) || undefined;

    const result = await userService.getUsers({ page, limit, search });
    return {
        status: 200,
        message: 'Users retrieved successfully',
        data: result
    };
};
