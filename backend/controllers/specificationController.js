import { Specification, SPECIFICATION_CATEGORIES } from '../models/Specification.js';
import { logActivity } from '../middleware/auditMiddleware.js';

const isValidCategory = (category) => SPECIFICATION_CATEGORIES.includes(category);
const sectionKeyByCategory = {
  clientSiteInfo: 'clientSiteInfo',
  productionIncidents: 'productionIncidents',
  infrastructureSpecs: 'infrastructureSpecs',
  applicationTemenosSpecs: 'applicationTemenosSpecs',
  databaseSpecs: 'databaseSpecs',
  integrationSpecs: 'integrationSpecs'
};

export const listSpecifications = async (req, res) => {
  try {
    const { category } = req.params;
    const client = req.query.client || 'SMIB';

    if (!isValidCategory(category)) {
      return res.status(400).json({ message: 'Invalid specification category.' });
    }

    const records = await Specification.find({ client, category }).sort({ createdAt: 1 });
    return res.json({ records });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to load specifications.' });
  }
};

export const upsertSpecification = async (req, res) => {
  try {
    const { id, client, category, recordId, data } = req.body;

    if (!client || !isValidCategory(category) || !recordId || data === undefined) {
      return res.status(400).json({ message: 'Client, category, recordId, and data are required.' });
    }

    const filter = id
      ? { _id: id }
      : { client, category, recordId };
    const record = await Specification.findOneAndUpdate(
      filter,
      { client, category, sectionKey: sectionKeyByCategory[category], recordId, data },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    await logActivity('SPECIFICATION_UPDATED', req.user, `${client}/${category}/${recordId}`, { data }, req);

    return res.status(200).json({ record });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to save specification.' });
  }
};

export const deleteSpecification = async (req, res) => {
  try {
    const { client, category } = req.query;
    const record = /^[a-f\d]{24}$/i.test(req.params.id)
      ? await Specification.findByIdAndDelete(req.params.id)
      : await Specification.findOneAndDelete({
        client,
        category,
        recordId: req.params.id
      });
    if (!record) return res.status(404).json({ message: 'Specification record not found.' });
    await logActivity('SPECIFICATION_DELETED', req.user, `${record.client}/${record.category}/${record.recordId}`, {}, req);
    return res.json({ message: 'Specification deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to delete specification.' });
  }
};
