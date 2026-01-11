import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { signup } from '../controllers/index';

const userRouter = express.Router();

userRouter.post('/register', asyncHandler(signup));

export default userRouter;
