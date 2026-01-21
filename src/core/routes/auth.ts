import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { auth } from '../middleware/auth';
import { registerRateLimit, loginRateLimit, generalRateLimit } from '../middleware/rateLimiter';
import { register, login, refresh, logout, logoutAll, profile } from '../controllers/auth';

const router = express.Router();

router.use(generalRateLimit);

router.post('/register', registerRateLimit, asyncHandler(register));
router.post('/login', loginRateLimit, asyncHandler(login));

router.use(auth);

router.post('/refresh', asyncHandler(refresh));
router.post('/logout', asyncHandler(logout));
router.post('/logout-all', asyncHandler(logoutAll));
router.get('/profile', asyncHandler(profile));

export default router;
