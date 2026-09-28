import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { User } from './models/User.js';
import { ClientSite } from './models/ClientSite.js';
import { Specification } from './models/Specification.js';
import { smibEnvironmentData } from '../mockData.js';

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(backendDirectory, '.env') });

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/env_db';

export const seedSuperAdminUser = async () => {
  const email = 'superadmin@sysenact.com';
  const result = await User.updateOne(
    { email },
    {
      $setOnInsert: {
        username: 'superadmin',
        email,
        password: await bcrypt.hash('Admin@123', 12),
        role: 'Super Admin'
      }
    },
    { upsert: true }
  );

  if (result.upsertedCount) console.log('Created default Super Admin user: superadmin');
  return User.findOne({ email });
};

export const seedAdminUser = seedSuperAdminUser;

export const seedStandardUser = async () => {
  const email = 'user@sysenact.com';
  const result = await User.updateOne(
    { email },
    {
      $setOnInsert: {
        username: 'user',
        email,
        password: await bcrypt.hash('AAbank@11.', 12),
        role: 'User'
      }
    },
    { upsert: true }
  );

  if (result.upsertedCount) console.log('Created default user: user');
  return User.findOne({ email });
};

const defaultClientSites = [
  { name: 'State Mortgage & Investment Bank', code: 'SMIB', country: 'Sri Lanka', status: 'Active' },
  { name: 'National Development Bank', code: 'NDB', country: 'Sri Lanka', status: 'Active' },
  { name: 'National Banking Limited', code: 'NBL-ENTERPRISE', country: 'Switzerland', status: 'Active' },
  { name: 'National Digital Banking Platform', code: 'NDBP-CLOUD', country: 'United Kingdom', status: 'Active' }
];

export const seedClientSites = async () => {
  await Promise.all(defaultClientSites.map((site) => ClientSite.updateOne(
    { code: site.code },
    { $set: site },
    { upsert: true }
  )));
  console.log(`Ensured ${defaultClientSites.length} default client sites.`);
};

const rowsOrFallback = (rows, fallback) => Array.isArray(rows) && rows.length > 0 ? rows : [fallback];

const sectionDocuments = [
  { sectionKey: 'clientSiteInfo', category: 'clientSiteInfo', client: 'SMIB', recordId: 'clientSiteInfo', data: rowsOrFallback(smibEnvironmentData.clientSiteInfo, { field: 'Status', value: 'N/A' }) },
  { sectionKey: 'infrastructureSpecs', category: 'infrastructureSpecs', client: 'SMIB', recordId: 'infrastructureSpecs', data: rowsOrFallback(smibEnvironmentData.infrastructureSpecs, { component: 'N/A', specification: 'N/A', quantity: 'N/A', hostname: 'N/A', version: 'N/A', notes: 'N/A' }) },
  { sectionKey: 'applicationTemenosSpecs', category: 'applicationTemenosSpecs', client: 'SMIB', recordId: 'applicationTemenosSpecs', data: rowsOrFallback(smibEnvironmentData.applicationTemenosSpecs, { parameter: 'Status', value: 'N/A' }) },
  { sectionKey: 'databaseSpecs', category: 'databaseSpecs', client: 'SMIB', recordId: 'databaseSpecs', data: rowsOrFallback(smibEnvironmentData.databaseSpecs, { parameter: 'Status', value: 'N/A' }) },
  { sectionKey: 'integrationSpecs', category: 'integrationSpecs', client: 'SMIB', recordId: 'integrationSpecs', data: rowsOrFallback(smibEnvironmentData.integrationSpecs, { integration: 'N/A', direction: 'N/A', protocol: 'N/A', endpoint: 'N/A', middleware: 'N/A', authentication: 'N/A', status: 'N/A' }) },
  { sectionKey: 'productionIncidents', category: 'productionIncidents', client: 'SMIB', recordId: 'productionIncidents', data: rowsOrFallback(smibEnvironmentData.productionIncidents, { incidentId: 'INC-N/A', client: 'SMIB', siteCountry: 'N/A', incidentDate: 'N/A', resolvedDate: 'N/A', environment: 'N/A', component: 'N/A', module: 'N/A', severity: 'N/A', summary: 'N/A', impact: 'N/A', status: 'N/A', rootCause: 'N/A', immediateResolution: 'N/A', resolutionOwner: 'N/A', rcaDocument: 'N/A' }) }
];

export const seedSpecifications = async () => {
  const existingClientCodes = await Specification.distinct('client', {
    client: /^SMIB(?:-PROD)?$/i
  });
  const specificationClient = existingClientCodes.find((code) => code.toUpperCase() === 'SMIB')
    || existingClientCodes.find((code) => code.toUpperCase() === 'SMIB-PROD')
    || 'SMIB';

  await Promise.all(sectionDocuments.map((section) => {
    const document = { ...section, client: specificationClient };
    return Specification.updateOne(
      { client: specificationClient, category: document.category, recordId: document.recordId },
      { $setOnInsert: document },
      { upsert: true }
    );
  }));
  console.log(`Ensured ${sectionDocuments.length} SMIB dashboard sections for ${specificationClient}.`);
};

export const connectAndSeedAdmin = async () => {
  const ownsConnection = mongoose.connection.readyState !== 1;

  try {
    if (ownsConnection) {
      await mongoose.connect(mongoURI, { dbName: 'env_db' });
    }

    await seedSuperAdminUser();
    await seedStandardUser();
    await seedClientSites();
    await seedSpecifications();
    return true;
  } finally {
    if (ownsConnection && mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
};

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  connectAndSeedAdmin()
    .catch((error) => {
      console.error('Database seed failed:', error.message);
      process.exitCode = 1;
    });
}
