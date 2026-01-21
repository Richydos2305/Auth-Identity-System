import Joi from 'joi';

// User validation schemas
const userSchemas = {
    register: Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().trim().required(),
        password: Joi.string()
            .min(8)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
            .message('Password must contain at least 8 characters with uppercase, lowercase, number and special character')
            .required()
        }),
        login: Joi.object({
        email: Joi.string().email().trim().required(),
        password: Joi.string().required()
    })
};

// Task validation schemas
const taskSchemas = {
    create: Joi.object({
        title: Joi.string().min(1).max(100).required(),
        description: Joi.string().min(1).max(500).required(),
        user_id: Joi.number().integer().positive().required()
    }),

    update: Joi.object({
        title: Joi.string().min(1).max(100).optional(),
        description: Joi.string().min(1).max(500).optional()
    })
};

// Validation functions
export const validateRegisterPayload = (userData: { name: string; email: string; password: string }) => {
    return userSchemas.register.validate(userData);
};

export const validateLoginPayload = (loginData: { email: string; password: string }) => {
    return userSchemas.login.validate(loginData);
};

export const validateCreateTaskPayload = (taskData: { title: string; description: string; user_id: number }) => {
    return taskSchemas.create.validate(taskData);
};

export const validateUpdateTaskPayload = (updateData: { title?: string; description?: string }) => {
    return taskSchemas.update.validate(updateData);
};

export const validateRefreshToken = (refreshToken: string) => {
    return Joi.string().min(10).required().validate(refreshToken);
};

export const validateUserId = (userId: number) => {
    return Joi.number().integer().positive().required().validate(userId);
};
