import { Router } from 'express';
import { createUser, listUsers, login } from '../controllers/authController.js';
import { verifyAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.get('/users', verifyToken, verifyAdmin, listUsers);
router.post('/create-user', verifyToken, verifyAdmin, createUser);

export default router;
