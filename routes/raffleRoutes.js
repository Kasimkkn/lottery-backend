import express from 'express';
import {
    createRaffle,
    getAllRaffles,
    getRaffleById,
    updateRaffle,
    deleteRaffle,
} from '../controllers/raffleController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { singleUpload } from '../middleware/mutler.js';

const router = express.Router();

router
    .route('/')
    .get(protect, authorize('superadmin', 'agent'), getAllRaffles)
    .post(protect, singleUpload, authorize('agent', 'superadmin'), createRaffle);

router
    .route('/:id')
    .get(protect, getRaffleById)
    .put(protect, singleUpload, authorize('superadmin', 'agent'), updateRaffle)
    .delete(protect, authorize('superadmin', 'agent'), deleteRaffle);

export default router;