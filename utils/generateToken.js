import jwt from 'jsonwebtoken';

export const generateToken = (userId, secret) => {
    return jwt.sign({ id: userId }, secret || process.env.JWT_SECRET, { expiresIn: '2d' });
};