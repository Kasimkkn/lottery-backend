import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    raffle: { type: mongoose.Schema.Types.ObjectId, ref: 'Raffle', required: true },
    selectedNumbers: { type: Number, required: true },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', TicketSchema);

export default Ticket;
