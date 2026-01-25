import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { auth } from '../middleware/auth';
import { getProfile } from '../controllers/users';

const router = Router();

router.get('/profile', auth, asyncHandler(getProfile));

export default router;
