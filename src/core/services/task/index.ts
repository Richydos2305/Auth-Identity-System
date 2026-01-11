import { TaskRepository } from '../../repositories/TaskRepository';
import { validateCreateTaskPayload, validateUpdateTaskPayload } from '../../helpers/validation';
import logger from '../../helpers/logger';

export class TaskService {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async createTask(taskData: { title: string; description: string; user_id: number }) {
        try {
            logger.info('Task creation attempt', { 
                userId: taskData.user_id, 
                title: taskData.title 
            });
            
            // Validation
            const { error, value } = validateCreateTaskPayload(taskData);
            if (error) {
                logger.warn('Task creation validation failed', { 
                    userId: taskData.user_id,
                    error: error.details[0].message 
                });
                throw new Error(error.details[0].message);
            }

            const { title, description, user_id } = value;

            const task = await this.taskRepository.create({
                title,
                description,
                user_id
            });

            logger.info('Task created successfully', { 
                taskId: task.id, 
                userId: task.user_id,
                title: task.title
            });

            return { task };
        } catch (error) {
            logger.error('Task creation error', {
                userId: taskData.user_id,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }

    async getUserTasks(userId: number) {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            const tasks = await this.taskRepository.findAll({ user_id: userId });
            
            return tasks;
        } catch (error) {
            throw error;
        }
    }

    async updateTask(taskId: number, updateData: { title?: string; description?: string }) {
        try {
            // Validate taskId
            if (!taskId || !Number.isInteger(taskId) || taskId <= 0) {
                throw new Error('Valid Task ID is required');
            }

            // Validation for update data
            const { error, value } = validateUpdateTaskPayload(updateData);
            if (error) {
                throw new Error(error.details[0].message);
            }

            // Check if task exists
            const existingTask = await this.taskRepository.find({ id: taskId });
            if (!existingTask) {
                throw new Error('Task not found');
            }

            const [affectedCount, updatedTasks] = await this.taskRepository.update(
                { id: taskId },
                value
            );

            if (affectedCount === 0) {
                throw new Error('Task update failed');
            }

            return { task: updatedTasks[0] };
        } catch (error) {
            throw error;
        }
    }

    async deleteTask(taskId: number, userId: number) {
        try {
            if (!taskId || !userId) {
                throw new Error('Task ID and User ID are required');
            }

            // Check if task exists and belongs to user
            const existingTask = await this.taskRepository.find({ 
                id: taskId, 
                user_id: userId 
            });
            
            if (!existingTask) {
                throw new Error('Task not found or you do not have permission to delete it');
            }

            const deletedCount = await this.taskRepository.delete({ id: taskId });
            
            if (deletedCount === 0) {
                throw new Error('Task deletion failed');
            }

            return { message: 'Task deleted successfully' };
        } catch (error) {
            throw error;
        }
    }

    async getTaskById(taskId: number, userId: number) {
        try {
            if (!taskId || !userId) {
                throw new Error('Task ID and User ID are required');
            }

            // Find task that belongs to the user
            const task = await this.taskRepository.find({ 
                id: taskId, 
                user_id: userId 
            });

            if (!task) {
                throw new Error('Task not found or you do not have permission to view it');
            }

            return { task };
        } catch (error) {
            throw error;
        }
    }
}
