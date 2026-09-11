import { AuditLog } from '../models/AuditLog.js';

export const listAuditLogs = async (req, res) => {
  try {
    const { search = '' } = req.query;
    const query = search
      ? {
          $or: [
            { 'performedBy.email': { $regex: search, $options: 'i' } },
            { action: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(500)
      .lean();
    return res.json({ logs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to load audit logs.' });
  }
};
