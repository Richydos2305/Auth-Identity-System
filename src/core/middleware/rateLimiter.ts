import rateLimit from 'express-rate-limit';
import { SecurityConfig } from '../constants';

const createRateLimitMessage = (type: string) => ({
    success: false,
    message: `Too many ${type} attempts from this IP address. Please try again later.`,
    retryAfter: SecurityConfig.RateLimitWindow / 1000
});

const rateLimitHandler = (type: string) => (req: any, res: any) => {
    res.status(429).json(createRateLimitMessage(type));
};

export const registerRateLimit = rateLimit({
    windowMs: SecurityConfig.RateLimitWindow,
    max: SecurityConfig.MaxLoginAttempts,
    message: createRateLimitMessage('registration'),
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler('registration')
});

export const loginRateLimit = rateLimit({
    windowMs: SecurityConfig.RateLimitWindow,
    max: SecurityConfig.MaxLoginAttempts * 2,
    message: createRateLimitMessage('login'),
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler('login')
});

export const generalRateLimit = rateLimit({
    windowMs: SecurityConfig.RateLimitWindow,
    max: 100,
    message: createRateLimitMessage(''),
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler('request')
});
