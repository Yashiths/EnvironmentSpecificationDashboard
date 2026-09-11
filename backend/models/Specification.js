import mongoose from 'mongoose';

export const SPECIFICATION_CATEGORIES = [
  'clientSiteInfo',
  'infrastructureSpecs',
  'applicationTemenosSpecs',
  'databaseSpecs',
  'integrationSpecs',
  'productionIncidents'
];

export const SPECIFICATION_SECTIONS = [
  'clientSiteInfo',
  'productionIncidents',
  'infrastructureSpecs',
  'applicationTemenosSpecs',
  'databaseSpecs',
  'integrationSpecs'
];

const specificationSchema = new mongoose.Schema(
  {
    client: { type: String, required: true, index: true },
    category: {
      type: String,
      required: true,
      enum: SPECIFICATION_CATEGORIES,
      index: true
    },
    sectionKey: { type: String, required: true, enum: SPECIFICATION_SECTIONS, index: true },
    recordId: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

specificationSchema.index({ client: 1, category: 1, recordId: 1 }, { unique: true });

export const Specification = mongoose.model('Specification', specificationSchema);
