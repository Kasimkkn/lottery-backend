import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import CustomError from '../utils/CustomError.js';
import { asyncHandler } from './asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                throw new CustomError('User not found.', 401);
            }

            next();
        } catch (error) {
            throw new CustomError('Not authorized, token failed.', 401);
        }
    }

    if (!token) {
        throw new CustomError('Not authorized, no token provided.', 401);
    }
});

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError(`${req.user.role.toUpperCase()} is not authorized to perform this action.`, 403);
        }
        next();
    };
};
