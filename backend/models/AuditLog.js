import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true, trim: true, index: true },
    performedBy: {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      email: { type: String, required: true, trim: true, index: true }
    },
    target: { type: String, required: true, trim: true },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: 'unknown' },
    status: { type: String, enum: ['success', 'failure'], default: 'success' },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { versionKey: false }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
