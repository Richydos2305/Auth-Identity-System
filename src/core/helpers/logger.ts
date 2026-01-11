import winston from 'winston';
import { settings } from '../config/application';

// Define custom log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    })
);

// Create Winston logger
const logger = winston.createLogger({
    level: (settings.environment) === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: [
        // Console transport for development
        new winston.transports.Console({
            format: (settings.environment) === 'production' ? logFormat : consoleFormat
        }),
        
        // File transport for errors
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        
        // File transport for all logs
        new winston.transports.File({
            filename: 'logs/combined.log'
        })
    ],
    
    // Handle uncaught exceptions
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' })
    ],
    
    // Handle unhandled promise rejections
    rejectionHandlers: [
        new winston.transports.File({ filename: 'logs/rejections.log' })
    ]
});

export default logger;
