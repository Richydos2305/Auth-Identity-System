import rateLimit from 'express-rate-limit';

const createRateLimitMessage = (type: string) => ({
    success: false,
    message: `Too many ${type} attempts from this IP address. Please try again later.`,
    retryAfter: 15 * 60
});

const rateLimitHandler = (type: string) => (req: any, res: any) => {
    res.status(429).json(createRateLimitMessage(type));
};

export const registerRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: createRateLimitMessage('registration'),
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler('registration')
});

export const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: createRateLimitMessage('login'),
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler('login')
});

export const generalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: createRateLimitMessage(''),
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler('request')
});
