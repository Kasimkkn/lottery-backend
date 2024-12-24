import Ticket from '../models/TicketModel.js';
import Raffle from '../models/RaffleModel.js';
import User from '../models/userModel.js';
import CustomError from '../utils/CustomError.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import transactionModel from '../models/transactionModel.js';

export const purchaseTicket = asyncHandler(async (req, res) => {
    const { userId, raffleId, selectedNumbers } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw new CustomError('User not found', 404);
    }

    const raffle = await Raffle.findById(raffleId);
    if (!raffle) {
        throw new CustomError('Raffle not found', 404);
    }

    if (raffle.entrants >= raffle.totalEntriesAllowed) {
        throw new CustomError('Raffle is full, no more entries allowed', 400);
    }

    const userTicketsCount = await Ticket.countDocuments({ user: userId, raffle: raffleId });
    if (userTicketsCount >= 5) {
        throw new CustomError('You can only purchase a maximum of 5 tickets for this raffle', 400);
    }

    const ticketPrice = raffle.ticketPrice;

    if (user.balance < ticketPrice) {
        throw new CustomError('Insufficient balance to purchase ticket', 400);
    }

    const ticket = await Ticket.create({
        user: userId,
        raffle: raffleId,
        selectedNumbers,
        price: ticketPrice
    });

    user.balance -= ticketPrice;
    await user.save();

    raffle.entrants += 1;
    await raffle.save();

    await transactionModel.create({
        user: userId,
        amount: ticketPrice,
        type: 'debit',
        description: `Ticket purchase for raffle: ${raffle.name}`
    });

    res.status(201).json({
        success: true,
        message: 'Ticket purchased successfully',
        ticket,
        newBalance: user.balance
    });
});

export const getTicketsByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const tickets = await Ticket.find({ user: userId }).populate('raffle').populate('user');
    if (!tickets || tickets.length === 0) {
        throw new CustomError('No tickets found for this user', 404);
    }

    res.status(200).json({
        success: true,
        tickets
    });
});

export const getAllTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find().populate('raffle').populate('user');
    if (!tickets || tickets.length === 0) {
        throw new CustomError('No tickets found', 404);
    }

    res.status(200).json({
        success: true,
        tickets
    });
});

export const getTicketById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ticket = await Ticket.findById(id).populate('raffle').populate('user');
    if (!ticket) {
        throw new CustomError('Ticket not found', 404);
    }

    res.status(200).json({
        success: true,
        ticket
    });
});

export const deleteTicket = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
        throw new CustomError('Ticket not found', 404);
    }

    await ticket.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Ticket deleted successfully'
    });
});
