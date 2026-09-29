import { Specification, SPECIFICATION_CATEGORIES } from '../models/Specification.js';
import { ClientSite } from '../models/ClientSite.js';
import { logActivity } from '../middleware/auditMiddleware.js';

const isValidCategory = (category) => SPECIFICATION_CATEGORIES.includes(category);
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exactMatch = (value) => new RegExp(`^${escapeRegex(value)}$`, 'i');
const categoryAliases = {
  'client-info': 'clientSiteInfo',
  clientInfo: 'clientSiteInfo',
  infrastructure: 'infrastructureSpecs',
  application: 'applicationTemenosSpecs',
  database: 'databaseSpecs',
  integration: 'integrationSpecs',
  incidents: 'productionIncidents'
};
const sectionKeyByCategory = {
  clientSiteInfo: 'clientSiteInfo',
  productionIncidents: 'productionIncidents',
  infrastructureSpecs: 'infrastructureSpecs',
  applicationTemenosSpecs: 'applicationTemenosSpecs',
  databaseSpecs: 'databaseSpecs',
  integrationSpecs: 'integrationSpecs'
};
const rowCategories = new Set([
  'infrastructureSpecs',
  'integrationSpecs',
  'productionIncidents'
]);

export const listSpecifications = async (req, res) => {
  try {
    const requestedCategory = req.params.category || req.query.category;
    const category = categoryAliases[requestedCategory] || requestedCategory;
    const client = String(req.query.siteCode || req.query.client || 'SMIB').trim();

    if (!isValidCategory(category)) {
      return res.status(400).json({ message: 'Invalid specification category.' });
    }

    const clientRecord = await ClientSite.findOne({
      $or: [{ code: exactMatch(client) }, { name: exactMatch(client) }]
    }).select('code name').lean();
    const legacySmibCodes = /^SMIB(?:-PROD)?$/i.test(client) ? ['SMIB', 'SMIB-PROD'] : [];
    const clientMatches = [client, clientRecord?.code, clientRecord?.name, ...legacySmibCodes]
      .filter(Boolean)
      .map(exactMatch);
    const matchingRecords = await Specification.find({
      client: { $in: clientMatches },
      category
    }).sort({ createdAt: 1 });
    const exactClientRecords = matchingRecords.filter(
      (record) => record.client.toLowerCase() === client.toLowerCase()
    );
    const records = exactClientRecords.length > 0 ? exactClientRecords : matchingRecords;
    const canonicalRecord = records.find((record) => record.recordId === category);
    if (canonicalRecord) return res.json({ records: [canonicalRecord] });

    if (rowCategories.has(category) && records.length > 0) {
      return res.json({
        records: [{
          client: records[0].client,
          category,
          sectionKey: sectionKeyByCategory[category],
          recordId: category,
          data: records.flatMap((record) => (
            Array.isArray(record.data) ? record.data : [record.data]
          ))
        }]
      });
    }

    return res.json({ records });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to load specifications.' });
  }
};

export const upsertSpecification = async (req, res) => {
  try {
    const { client, category, data, operation } = req.body;

    if (!client || !isValidCategory(category) || data === undefined) {
      return res.status(400).json({ message: 'Client, category, and data are required.' });
    }

    const filter = { client, category, recordId: category };
    let record;
    if (operation === 'add') {
      const parentRecord = await Specification.findOne(filter);
      if (parentRecord) {
        parentRecord.data.push(data);
        parentRecord.markModified('data');
        record = await parentRecord.save();
      } else {
        const legacyRecords = await Specification.find({
          client,
          category,
          recordId: { $ne: category }
        }).sort({ createdAt: 1 });
        const existingRows = legacyRecords.flatMap((legacyRecord) => (
          Array.isArray(legacyRecord.data) ? legacyRecord.data : [legacyRecord.data]
        ));
        record = await Specification.findOneAndUpdate(
          filter,
          {
            client,
            category,
            sectionKey: sectionKeyByCategory[category],
            recordId: category,
            data: [...existingRows, data]
          },
          { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );
      }
    } else {
      record = await Specification.findOneAndUpdate(
        filter,
        { client, category, sectionKey: sectionKeyByCategory[category], recordId: category, data },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );
    }

    await logActivity('SPECIFICATION_UPDATED', req.user, `${client}/${category}`, { data }, req);

    return res.status(200).json({ record });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to save specification.' });
  }
};

export const deleteSpecification = async (req, res) => {
  try {
    const { client, category, rowIndex } = req.query;
    if (!client || !isValidCategory(category)) {
      return res.status(400).json({ message: 'Client and a valid category are required.' });
    }

    const record = await Specification.findOne({ client, category, recordId: category });
    if (record && Array.isArray(record.data)) {
      const index = Number(rowIndex);
      const targetId = req.params.id;
      const indexedRow = Number.isInteger(index) && index >= 0 ? record.data[index] : null;
      const indexedRowId = indexedRow?.id || indexedRow?.incidentId;
      const resolvedIndex = indexedRow && (!indexedRowId || indexedRowId === targetId)
        ? index
        : record.data.findIndex((row) => [row.id, row.incidentId].includes(targetId));
      if (resolvedIndex < 0) {
        return res.status(404).json({ message: 'Specification row not found.' });
      }

      const [deletedRow] = record.data.splice(resolvedIndex, 1);
      record.markModified('data');
      await record.save();
      await logActivity('SPECIFICATION_DELETED', req.user, `${client}/${category}/${targetId}`, {}, req);
      return res.json({ message: 'Specification deleted successfully.', record, deletedRow });
    }

    const legacyRecord = await Specification.findOneAndDelete({
      client,
      category,
      recordId: req.params.id
    });
    if (!legacyRecord) return res.status(404).json({ message: 'Specification record not found.' });
    await logActivity('SPECIFICATION_DELETED', req.user, `${client}/${category}/${legacyRecord.recordId}`, {}, req);
    return res.json({ message: 'Specification deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to delete specification.' });
  }
};
