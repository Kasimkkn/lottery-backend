import express from 'express';
import { purchaseTicket, getTicketsByUser } from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, purchaseTicket);
router.get('/:userId', protect, getTicketsByUser);

export default router;
