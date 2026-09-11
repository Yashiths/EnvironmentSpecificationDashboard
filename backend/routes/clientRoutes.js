import { Router } from 'express';
import {
  createClient,
  deleteClient,
  listClients,
  updateClientStatus
} from '../controllers/clientController.js';
import { verifyAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listClients);
router.post('/', verifyToken, verifyAdmin, createClient);
router.patch('/:id/status', verifyToken, verifyAdmin, updateClientStatus);
router.delete('/:id', verifyToken, verifyAdmin, deleteClient);

export default router;
