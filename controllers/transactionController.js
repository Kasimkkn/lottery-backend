import Transaction from '../models/transactionModel.js';
import User from '../models/userModel.js';
import CustomError from '../utils/CustomError.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const createTransaction = asyncHandler(async (req, res) => {
    const { userId, amount, type, description } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw new CustomError('User not found', 404);
    }

    if (amount <= 0) {
        throw new CustomError('Amount must be greater than zero', 400);
    }

    if (type === 'debit' && user.balance < amount) {
        throw new CustomError('Insufficient balance', 400);
    }

    const transaction = await Transaction.create({
        user: userId,
        amount,
        type,
        description
    });

    user.balance = type === 'credit' ? user.balance + amount : user.balance - amount;
    await user.save();

    res.status(201).json({
        success: true,
        message: 'Transaction processed successfully',
        transaction,
        newBalance: user.balance
    });
});
