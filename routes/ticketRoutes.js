import express from 'express';
import { purchaseTicket, getTicketsByUser, getAllTickets, getTicketById, deleteTicket } from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, purchaseTicket);
router.get('/:userId', protect, getTicketsByUser);
router.get('/', protect, authorize('superadmin', 'agent'), getAllTickets);
router.get('/:id', protect, authorize('superadmin', 'agent'), getTicketById);
router.delete('/:id', protect, authorize('superadmin', 'agent'), deleteTicket);

export default router;
