import { Router } from 'express';
import { resetUserPassword } from '../controllers/authController.js';
import { verifyAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.patch('/:id/reset-password', verifyToken, verifyAdmin, resetUserPassword);

export default router;
