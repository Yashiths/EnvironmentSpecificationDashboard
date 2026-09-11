import { Router } from 'express';
import {
  deleteSpecification,
  listSpecifications,
  upsertSpecification
} from '../controllers/specificationController.js';
import { verifyAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:category', verifyToken, listSpecifications);
router.post('/', verifyToken, verifyAdmin, upsertSpecification);
router.delete('/:id', verifyToken, verifyAdmin, deleteSpecification);

export default router;
