import Joi from 'joi';
import { ValidationError } from '../errors/CustomErrors';
import logger from './logger';
import { RegisterPayload, LoginPayload } from '../interfaces/validation';

export const validate = (
    request: { [key: string]: any }, 
    schema: Joi.ObjectSchema<any> | Joi.Schema, 
    context?: string,
    allowUnknown = false
): void => {
    const validation = schema.validate(request, { abortEarly: false, allowUnknown });
    const { error } = validation;

    if (error) {
        if (context) {
            logger.warn(`Validation failed: ${context}`, { 
                error: error.details[0].message,
                input: request 
            });
        }
        throw new ValidationError(error.details[0].message);
    }
};

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
        .message('Password must contain at least 8 characters with uppercase, lowercase, number and special character')
        .required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().required()
});

const refreshTokenSchema = Joi.string().min(10).required();
const userIdSchema = Joi.number().integer().positive().required();

export const validateRegisterPayload = (userData: RegisterPayload): void => {
    validate(userData, registerSchema, 'User Registration');
};

export const validateLoginPayload = (loginData: LoginPayload): void => {
    validate(loginData, loginSchema, 'User Login');
};

export const validateRefreshToken = (refreshToken: string) => {
    const tokenWrapper = { token: refreshToken };
    validate(tokenWrapper, Joi.object({ token: refreshTokenSchema }), 'Refresh Token');
    return tokenWrapper.token;
};

export const validateUserId = (userId: number) => {
    const userIdWrapper = { userId };
    validate(userIdWrapper, Joi.object({ userId: userIdSchema }), 'user ID');
    return userIdWrapper.userId;
};
