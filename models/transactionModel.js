import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Transaction', TransactionSchema);
