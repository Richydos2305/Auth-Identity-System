import Joi from 'joi';

// User validation schemas
const userSchemas = {
    signup: Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
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
export const validateSignupPayload = (userData: { name: string; email: string; password: string }) => {
    return userSchemas.signup.validate(userData);
};

export const validateCreateTaskPayload = (taskData: { title: string; description: string; user_id: number }) => {
    return taskSchemas.create.validate(taskData);
};

export const validateUpdateTaskPayload = (updateData: { title?: string; description?: string }) => {
    return taskSchemas.update.validate(updateData);
};
