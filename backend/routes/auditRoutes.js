import { Router } from 'express';
import { listAuditLogs } from '../controllers/auditController.js';
import { verifySuperAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, verifySuperAdmin, listAuditLogs);

export default router;
