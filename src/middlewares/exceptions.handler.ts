import { NextFunction, Request, Response } from "express";

/**
 * Middleware to handle exceptions
 *
 * @param {any} error - The error object
 * @param {Request} request - The request object
 * @param {Response} result - The response object
 * @param {NextFunction} next - The next function
 *
 * @constructor
 *
 * @see https://expressjs.com/en/guide/error-handling.html
 */
export const ExceptionsHandler = (error: any, request: Request, result: Response, next: NextFunction) => {

    // Default error handler
    if (result.headersSent){
        return next(error);
    }

    // Handle custom exceptions
    if (error.status && error.error) {
        return result.status(error.status).json({ error: error.error });
    }

    // Handle unexpected errors
    return result.status(500).json({ error: 'Erreur interne' });
}