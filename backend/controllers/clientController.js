import { ClientSite } from '../models/ClientSite.js';
import { Specification } from '../models/Specification.js';
import { createDefaultSiteSpecs } from '../../mockData.js';
import { logActivity } from '../middleware/auditMiddleware.js';

export const listClients = async (_req, res) => {
  try {
      const clients = await ClientSite.find().sort({ name: 1 });
    return res.json({ clients });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to load banking clients.' });
  }
};

export const createClient = async (req, res) => {
  try {
    const { name, code, country } = req.body;
    if (!name || !code || !country) {
      return res.status(400).json({ message: 'Client name, site code, and country are required.' });
    }

    const client = await ClientSite.create({ name, code, country });
    const defaults = createDefaultSiteSpecs();
    const records = [
      { category: 'clientSiteInfo', sectionKey: 'clientSiteInfo', recordId: 'clientSiteInfo', data: {
        client: name, country, site: 'N/A', environment: 'N/A', goLiveDate: 'N/A', owner: 'N/A',
        supportContact: 'N/A', licenseTier: 'N/A', customFields: {}
      } },
      { category: 'applicationTemenosSpecs', sectionKey: 'applicationTemenosSpecs', recordId: 'applicationTemenosSpecs', data: defaults.applicationTemenosSpecs },
      { category: 'databaseSpecs', sectionKey: 'databaseSpecs', recordId: 'databaseSpecs', data: defaults.databaseSpecs },
      { sectionKey: 'infrastructureSpecs', category: 'infrastructureSpecs', recordId: 'infrastructureSpecs', data: defaults.infrastructureSpecs.map((data, index) => ({ ...data, id: `INF-${client.code}-${index + 1}`, spec: data.specification })) },
      { sectionKey: 'integrationSpecs', category: 'integrationSpecs', recordId: 'integrationSpecs', data: defaults.integrationSpecs.map((data, index) => ({ ...data, id: `INT-${client.code}-${index + 1}`, name: data.integration })) }
    ];
    await Specification.insertMany(records.map(record => ({ client: client.code, ...record })));
    await logActivity('CLIENT_SITE_CREATED', req.user, client.code, { name: client.name, country: client.country }, req);
    return res.status(201).json({ client });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'That site code already exists.' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Unable to create banking client.' });
  }
};

export const updateClientStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Active or Inactive.' });
    }

    const client = await ClientSite.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!client) return res.status(404).json({ message: 'Banking client not found.' });
    await logActivity('CLIENT_SITE_STATUS_UPDATED', req.user, client.code, { status }, req);
    return res.json({ client });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to update banking client.' });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const client = await ClientSite.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Banking client not found.' });
    await logActivity('CLIENT_SITE_DELETED', req.user, client.code, { name: client.name }, req);
    return res.json({ message: 'Banking client deleted.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to delete banking client.' });
  }
};
