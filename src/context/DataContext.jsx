import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { INITIAL_MOCK_DATA } from '../data/mockData';
import { smibEnvironmentData } from '../mockData.js';
import { apiUrl } from '../config/api';

const DataContext = createContext();

const getFieldValue = (rows, field) => rows.find(row => row.field === field)?.value || '';
const getParameterValue = (rows, parameter) => rows.find(row => row.parameter === parameter)?.value || '';
const normalizeClientInfo = (rows) => {
  if (!Array.isArray(rows)) return rows;
  const values = Object.fromEntries(rows.map(row => [row.field, row.value]));
  return {
    rows,
    client: values.Client || 'N/A',
    country: values.Country || 'N/A',
    site: values.Site || 'N/A',
    environment: values.Environment || 'N/A',
    environmentType: values['Environment Type'] || 'N/A',
    drSite: values['DR Site'] || 'N/A',
    goLiveDate: values['Go-Live Date'] || 'N/A',
    lastReviewed: values['Last Reviewed'] || 'N/A',
    nextReviewDate: values['Next Review Date'] || 'N/A',
    owner: values['Environment Owner'] || 'N/A',
    applicationOwner: values['Application Owner'] || 'N/A',
    supportContact: values['Application Owner'] || 'N/A',
    licenseTier: values['Environment Type'] || 'N/A'
  };
};

const createSmibClientData = () => ({
  ...INITIAL_MOCK_DATA.SMIB,
  clientInfo: {
    client: getFieldValue(smibEnvironmentData.clientSiteInfo, 'Client'),
    country: getFieldValue(smibEnvironmentData.clientSiteInfo, 'Country'),
    site: getFieldValue(smibEnvironmentData.clientSiteInfo, 'Site'),
    environment: getFieldValue(smibEnvironmentData.clientSiteInfo, 'Environment'),
    environmentType: getFieldValue(smibEnvironmentData.clientSiteInfo, 'Environment Type'),
    drSite: getFieldValue(smibEnvironmentData.clientSiteInfo, 'DR Site'),
    goLiveDate: getFieldValue(smibEnvironmentData.clientSiteInfo, 'Go-Live Date'),
    lastReviewed: getFieldValue(smibEnvironmentData.clientSiteInfo, 'Last Reviewed'),
    nextReviewDate: getFieldValue(smibEnvironmentData.clientSiteInfo, 'Next Review Date'),
    owner: getFieldValue(smibEnvironmentData.clientSiteInfo, 'Environment Owner'),
    applicationOwner: getFieldValue(smibEnvironmentData.clientSiteInfo, 'Application Owner'),
    supportContact: getFieldValue(smibEnvironmentData.clientSiteInfo, 'Application Owner'),
    licenseTier: getFieldValue(smibEnvironmentData.clientSiteInfo, 'Environment Type')
  },
  infrastructure: smibEnvironmentData.infrastructureSpecs.map((item, index) => ({
    id: `INF-SMIB-${index + 1}`,
    component: item.component,
    spec: item.specification,
    quantity: item.quantity,
    hostname: item.hostname,
    version: item.version,
    notes: item.notes
  })),
  appSpecs: {
    temenosProduct: getParameterValue(smibEnvironmentData.applicationTemenosSpecs, 'Temenos Product'),
    release: getParameterValue(smibEnvironmentData.applicationTemenosSpecs, 'Temenos Release'),
    tafjVersion: getParameterValue(smibEnvironmentData.applicationTemenosSpecs, 'TAFJ Version'),
    irisVersion: getParameterValue(smibEnvironmentData.applicationTemenosSpecs, 'IRIS Version'),
    javaVersion: getParameterValue(smibEnvironmentData.applicationTemenosSpecs, 'Java Version'),
    nodes: getParameterValue(smibEnvironmentData.applicationTemenosSpecs, 'Number of Application Nodes'),
    cicdTool: getParameterValue(smibEnvironmentData.applicationTemenosSpecs, 'CI/CD Tool'),
    deploymentPath: getParameterValue(smibEnvironmentData.applicationTemenosSpecs, 'Deployment Model')
  },
  applicationTemenosSpecs: smibEnvironmentData.applicationTemenosSpecs,
  dbSpecs: smibEnvironmentData.databaseSpecs,
  integrations: smibEnvironmentData.integrationSpecs.map((item, index) => ({
    id: `INT-SMIB-${index + 1}`,
    name: item.integration,
    direction: item.direction,
    protocol: item.protocol,
    endpoint: item.endpoint,
    middleware: item.middleware,
    authentication: item.authentication,
    status: item.status
  })),
  incidents: smibEnvironmentData.productionIncidents.map((incident) => ({
    ...incident,
    id: incident.incidentId,
    title: incident.summary,
    severity: incident.severity,
    environment: incident.environment,
    status: incident.status,
    impact: incident.impact,
    rootCause: incident.rootCause,
    resolution: incident.immediateResolution,
    owner: incident.resolutionOwner,
    rcaId: incident.rcaDocument,
    reportedDate: incident.incidentDate,
    resolvedDate: incident.resolvedDate
  }))
});

const createInitialData = () => ({
  ...INITIAL_MOCK_DATA,
  SMIB: createSmibClientData()
});

export const DataProvider = ({ children }) => {
  const { token } = useAuth();
  const [clients, setClients] = useState([]);
  const [activeClientId, setActiveClientId] = useState(null);
  const [data, setData] = useState(createInitialData);
  const [isLoading, setIsLoading] = useState(false);

  const activeClientRecord = clients.find(client => client._id === activeClientId) || clients[0];
  const activeClient = activeClientRecord?.code || 'SMIB';
  const specificationClient = activeClient === 'SMIB-PROD' ? 'SMIB' : activeClient;
  const currentClientData = data[activeClient] || data.SMIB;

  const notify = (type, message) => {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { type, message } }));
  };

  const apiRequest = async (url, options = {}) => {
    const response = await fetch(apiUrl(url), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Request failed.');
    return result;
  };

  const refreshClients = async () => {
    const response = await fetch(apiUrl('/api/clients'));
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Unable to load clients.');
    setClients(result.clients);
    setActiveClientId(currentId => (
      result.clients.some(client => client._id === currentId)
        ? currentId
          : result.clients.find(client => client.code === 'SMIB' && client.status === 'Active')?._id
          || result.clients.find(client => client.status === 'Active')?._id
          || null
    ));
    return result.clients;
  };

  const setActiveClient = (clientIdOrCode) => {
    const selected = clients.find(client => client._id === clientIdOrCode || client.code === clientIdOrCode);
    setActiveClientId(selected?._id || clientIdOrCode);
  };

  useEffect(() => {
    refreshClients().catch(error => notify('error', `Clients unavailable: ${error.message}`));
  }, []);

  const persistRecord = async (category, recordId, record) => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const result = await apiRequest('/api/specifications', {
        method: 'POST',
        body: JSON.stringify({ client: specificationClient, category, recordId, data: record })
      });
      notify('success', 'Changes saved to MongoDB.');
      return result.record;
    } catch (error) {
      notify('error', `Save failed: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    const categories = ['clientSiteInfo', 'infrastructureSpecs', 'applicationTemenosSpecs', 'databaseSpecs', 'integrationSpecs', 'productionIncidents'];
    const loadLiveData = async () => {
      setIsLoading(true);
      try {
        const responses = await Promise.all(categories.map(category =>
          apiRequest(`/api/specifications/${category}?client=${encodeURIComponent(activeClient)}`)
        ));
        const records = Object.fromEntries(categories.map((category, index) => [category, responses[index].records]));
        const clientInfoData = records.clientSiteInfo[0]?.data;
        const applicationData = records.applicationTemenosSpecs[0]?.data;
        const infrastructureData = records.infrastructureSpecs[0]?.data || [];
        const integrationData = records.integrationSpecs[0]?.data || [];
        const incidentData = records.productionIncidents[0]?.data || [];
        setData(prev => ({
          ...prev,
          [activeClient]: {
            ...prev[activeClient],
            clientInfo: normalizeClientInfo(clientInfoData) || prev[activeClient]?.clientInfo,
            infrastructure: infrastructureData.map((item, index) => ({ ...item, id: item.id || `INF-${activeClient}-${index + 1}`, spec: item.spec || item.specification })),
            appSpecs: Array.isArray(applicationData)
              ? applicationData.reduce((values, row) => ({ ...values, [row.parameter]: row.value }), {})
              : applicationData || prev[activeClient]?.appSpecs,
            applicationTemenosSpecs: Array.isArray(applicationData)
              ? applicationData
              : prev[activeClient]?.applicationTemenosSpecs,
            dbSpecs: records.databaseSpecs[0]?.data || prev[activeClient]?.dbSpecs,
            integrations: integrationData.map((item, index) => ({ ...item, id: item.id || `INT-${activeClient}-${index + 1}`, name: item.name || item.integration })),
            incidents: incidentData.map((item, index) => ({ ...item, id: item.id || item.incidentId || `INC-${activeClient}-${index + 1}`, title: item.title || item.summary }))
          }
        }));
      } catch (error) {
        notify('error', `Live data unavailable: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadLiveData();
  }, [activeClient, token]);

  // --- CRUD METHODS FOR THE 5 SPECIFICATIONS ---

  // 1. Client Info Update
  const updateClientInfo = async (updatedInfo) => {
    const fieldMap = {
      client: 'Client',
      country: 'Country',
      site: 'Site',
      environment: 'Environment',
      environmentType: 'Environment Type',
      drSite: 'DR Site',
      goLiveDate: 'Go-Live Date',
      lastReviewed: 'Last Reviewed',
      nextReviewDate: 'Next Review Date',
      owner: 'Environment Owner',
      applicationOwner: 'Application Owner'
    };
    const rows = Object.entries(fieldMap).map(([key, field]) => ({ field, value: updatedInfo[key] || 'N/A' }));
    await persistRecord('clientSiteInfo', 'clientSiteInfo', rows);
    setData(prev => ({
      ...prev,
      [activeClient]: {
        ...prev[activeClient],
        clientInfo: {
          ...prev[activeClient]?.clientInfo,
          ...updatedInfo
        }
      }
    }));
  };

  // 2. Infrastructure Specs CRUD
  const addInfraSpec = async (newInfra) => {
    const id = `INF-${activeClient}-${Math.floor(10 + Math.random() * 90)}`;
    const fullInfra = {
      id, component: 'N/A', spec: 'N/A', quantity: 'N/A', hostname: 'N/A', version: 'N/A', notes: 'N/A',
      customFields: [], ...newInfra
    };
    setData(prev => ({
      ...prev,
      [activeClient]: {
        ...prev[activeClient],
        infrastructure: [...(prev[activeClient]?.infrastructure || []), fullInfra]
      }
    }));
    await persistRecord('infrastructureSpecs', id, fullInfra);
  };

  const updateInfraSpec = async (id, updatedFields) => {
    const updated = { ...(currentClientData.infrastructure || []).find(item => item.id === id), ...updatedFields };
    await persistRecord('infrastructureSpecs', id, updated);
    setData(prev => ({
      ...prev,
      [activeClient]: {
        ...prev[activeClient],
        infrastructure: (prev[activeClient]?.infrastructure || []).map(item =>
          item.id === id ? { ...item, ...updatedFields } : item
        )
      }
    }));
  };

  const deleteInfraSpec = async (id) => {
    if (token) {
      try {
        await apiRequest(`/api/specifications/${encodeURIComponent(id)}?client=${specificationClient}&category=infrastructureSpecs`, { method: 'DELETE' });
        notify('success', 'Specification deleted.');
      } catch (error) { notify('error', `Delete failed: ${error.message}`); }
    }
    setData(prev => ({
      ...prev,
      [activeClient]: {
        ...prev[activeClient],
        infrastructure: (prev[activeClient]?.infrastructure || []).filter(item => item.id !== id)
      }
    }));
  };

  // 3. Application Specs Update
  const updateAppSpecs = async (updatedAppSpecs) => {
    await persistRecord('applicationTemenosSpecs', 'applicationTemenosSpecs', updatedAppSpecs);
    const updatedRows = Array.isArray(updatedAppSpecs) ? updatedAppSpecs : null;
    setData(prev => ({
      ...prev,
      [activeClient]: {
        ...prev[activeClient],
        ...(updatedRows ? {
          applicationTemenosSpecs: updatedRows,
          appSpecs: updatedRows.reduce((values, row) => ({
            ...values,
            [row.parameter]: row.value
          }), {})
        } : { appSpecs: { ...prev[activeClient]?.appSpecs, ...updatedAppSpecs } })
      }
    }));
  };

  // 4. Database Specs Update
  const updateDbSpecs = async (newDbArray) => {
    await persistRecord('databaseSpecs', 'databaseSpecs', newDbArray);
    setData(prev => ({
      ...prev,
      [activeClient]: {
        ...prev[activeClient],
        dbSpecs: newDbArray
      }
    }));
  };

  // 5. Integration Specs CRUD
  const addIntegrationSpec = async (newInt) => {
    const id = `INT-${activeClient}-${Math.floor(10 + Math.random() * 90)}`;
    const fullInt = { id, status: 'Active', ...newInt };
    setData(prev => ({
      ...prev,
      [activeClient]: {
        ...prev[activeClient],
        integrations: [...(prev[activeClient]?.integrations || []), fullInt]
      }
    }));
    await persistRecord('integrationSpecs', id, fullInt);
  };

  const updateIntegrationSpec = async (id, updatedFields) => {
    const updated = { ...(currentClientData.integrations || []).find(item => item.id === id), ...updatedFields };
    await persistRecord('integrationSpecs', id, updated);
    setData(prev => ({
      ...prev,
      [activeClient]: {
        ...prev[activeClient],
        integrations: (prev[activeClient]?.integrations || []).map(item =>
          item.id === id ? { ...item, ...updatedFields } : item
        )
      }
    }));
  };

  const deleteIntegrationSpec = async (id) => {
    if (token) {
      try {
        await apiRequest(`/api/specifications/${encodeURIComponent(id)}?client=${specificationClient}&category=integrationSpecs`, { method: 'DELETE' });
        notify('success', 'Integration deleted.');
      } catch (error) { notify('error', `Delete failed: ${error.message}`); }
    }
    setData(prev => ({
      ...prev,
      [activeClient]: {
        ...prev[activeClient],
        integrations: (prev[activeClient]?.integrations || []).filter(item => item.id !== id)
      }
    }));
  };

  // 6. Production Incident Register CRUD
  const addIncident = async (newIncident) => {
    const id = `INC-${activeClient}-${Date.now()}`;
    const fullIncident = { id, reportedDate: new Date().toISOString(), ...newIncident };
    setData(prev => ({
      ...prev,
      [activeClient]: {
        ...prev[activeClient],
        incidents: [...(prev[activeClient]?.incidents || []), fullIncident]
      }
    }));
    await persistRecord('productionIncidents', id, fullIncident);
  };

  const updateIncident = async (id, updatedFields) => {
    const updated = { ...(currentClientData.incidents || []).find(item => item.id === id), ...updatedFields };
    await persistRecord('productionIncidents', id, updated);
    setData(prev => ({
      ...prev,
      [activeClient]: {
        ...prev[activeClient],
        incidents: (prev[activeClient]?.incidents || []).map(item =>
          item.id === id ? { ...item, ...updatedFields } : item
        )
      }
    }));
  };

  const deleteIncident = async (id) => {
    if (token) {
      try {
        await apiRequest(`/api/specifications/${encodeURIComponent(id)}?client=${specificationClient}&category=productionIncidents`, { method: 'DELETE' });
        notify('success', 'Incident deleted.');
      } catch (error) { notify('error', `Delete failed: ${error.message}`); }
    }
    setData(prev => ({
      ...prev,
      [activeClient]: {
        ...prev[activeClient],
        incidents: (prev[activeClient]?.incidents || []).filter(item => item.id !== id)
      }
    }));
  };

  const resetToDefaultData = () => {
    setData(createInitialData());
  };

  return (
    <DataContext.Provider
      value={{
        activeClient,
        activeClientId,
        clients,
        setActiveClient,
        setActiveClientId,
        refreshClients,
        allData: data,
        currentClientData,
        updateClientInfo,
        addInfraSpec,
        updateInfraSpec,
        deleteInfraSpec,
        updateAppSpecs,
        updateDbSpecs,
        addIntegrationSpec,
        updateIntegrationSpec,
        deleteIntegrationSpec,
        addIncident,
        updateIncident,
        deleteIncident,
        resetToDefaultData,
        isLoading
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
