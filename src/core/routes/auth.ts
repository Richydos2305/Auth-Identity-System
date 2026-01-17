import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { registerRateLimit, loginRateLimit, generalRateLimit } from '../middleware/rateLimiter';
import { register, login, refresh, logout, profile } from '../controllers/auth';

const router = express.Router();

router.use(generalRateLimit);

router.post('/register', registerRateLimit, asyncHandler(register));
router.post('/login', loginRateLimit, asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));
router.post('/logout', asyncHandler(logout));
router.get('/profile', asyncHandler(profile));

export default router;
