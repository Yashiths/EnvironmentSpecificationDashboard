import { AuditLog } from '../models/AuditLog.js';

export const logActivity = async (action, user, target, details = {}, req = null, status = 'success') => {
  try {
    await AuditLog.create({
      action,
      performedBy: {
        user: user?.id,
        email: user?.email || 'unknown'
      },
      target,
      details,
      ipAddress: req?.ip || req?.headers?.['x-forwarded-for'] || 'unknown',
      status
    });
  } catch (error) {
    console.error('Audit log write failed:', error);
  }
};
