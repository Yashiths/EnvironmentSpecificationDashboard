export const smibEnvironmentData = {
  // -------------------------------------------------------------
  // 1. CLIENT & SITE INFORMATION (SMIB)
  // -------------------------------------------------------------
  clientSiteInfo: [
    { field: "Client", value: "SMIB (State Mortgage & Investment Bank)" },
    { field: "Country", value: "Sri Lanka" },
    { field: "Site", value: "Colombo Main DC & Kandy DR Footprint" },
    { field: "Environment", value: "Production (HA Cluster)" },
    { field: "Environment Type", value: "Primary DC" },
    { field: "DR Site", value: "DR-Kandy" },
    { field: "Go-Live Date", value: "15-Aug-2026" },
    { field: "Last Reviewed", value: "04-Sep-2026" },
    { field: "Next Review Date", value: "04-Dec-2026" },
    { field: "Environment Owner", value: "Infrastructure Team" },
    { field: "Application Owner", value: "Development Team" }
  ],

  // -------------------------------------------------------------
  // 2. INFRASTRUCTURE SPECIFICATION (SMIB)
  // -------------------------------------------------------------
  infrastructureSpecs: [
    { component: "Application Server", specification: "Linux Enterprise", quantity: "4", hostname: "smib-app-01..04", version: "RHEL 9", notes: "Primary App Nodes" },
    { component: "Database Server", specification: "16 vCPU / 64GB RAM", quantity: "2", hostname: "smib-db01 / smib-db02", version: "PostgreSQL 16.x", notes: "Primary / Standby HA" },
    { component: "Load Balancer", specification: "HAProxy / F5", quantity: "2", hostname: "smib-lb-01", version: "v2.8", notes: "TLS Offloading" },
    { component: "Kafka", specification: "Message Broker Cluster", quantity: "3", hostname: "smib-kafka-01..03", version: "3.5.x", notes: "Core Payment Switch Events" },
    { component: "Redis", specification: "In-Memory Cache", quantity: "2", hostname: "smib-redis-01", version: "7.x", notes: "Session & Token Caching" }
  ],

  // -------------------------------------------------------------
  // 3. APPLICATION / TEMENOS SPECIFICATION (SMIB)
  // -------------------------------------------------------------
  applicationTemenosSpecs: [
    { parameter: "Temenos Product", value: "Transact" },
    { parameter: "Temenos Release", value: "R26" },
    { parameter: "TAFJ Version", value: "2026.01" },
    { parameter: "Application Version", value: "v26.1.4" },
    { parameter: "IRIS Version", value: "v4.2" },
    { parameter: "Java Version", value: "Java 17" },
    { parameter: "JVM", value: "OpenJDK" },
    { parameter: "Application Server", value: "JBoss EAP / WildFly" },
    { parameter: "Operating System", value: "RHEL 9" },
    { parameter: "Deployment Model", value: "Kubernetes/VM" },
    { parameter: "Number of Application Nodes", value: "4" },
    { parameter: "Deployment Tool", value: "Helm" },
    { parameter: "CI/CD Tool", value: "Jenkins" },
    { parameter: "Artifact Repository", value: "Nexus" },
    { parameter: "Source Repository", value: "Bitbucket" }
  ],

  // -------------------------------------------------------------
  // 4. DATABASE SPECIFICATION (SMIB)
  // -------------------------------------------------------------
  databaseSpecs: [
    { parameter: "Database", value: "PostgreSQL" },
    { parameter: "Version", value: "16.x" },
    { parameter: "DB Host", value: "SMIB-DB01" },
    { parameter: "DB Port", value: "5432" },
    { parameter: "Database Name", value: "SMIB_TRANSACT" },
    { parameter: "Primary/Standby", value: "Yes" },
    { parameter: "HA Technology", value: "Patroni / Streaming Replication" },
    { parameter: "CPU", value: "16 vCPU" },
    { parameter: "Memory", value: "64 GB" },
    { parameter: "Storage", value: "2 TB" },
    { parameter: "Backup Frequency", value: "Daily" },
    { parameter: "Backup Retention", value: "30 days" },
    { parameter: "Archive/WAL", value: "Enabled" },
    { parameter: "Last Backup Test Date", value: "01-Sep-2026" }
  ],

  // -------------------------------------------------------------
  // 5. INTEGRATION SPECIFICATION (SMIB)
  // -------------------------------------------------------------
  integrationSpecs: [
    { integration: "Core Payment Switch", direction: "Outbound", protocol: "ISO 20022", endpoint: "SMIB-SWITCH", middleware: "Kafka", authentication: "MTLS", status: "Active" },
    { integration: "Payment Core", direction: "Inbound", protocol: "REST", endpoint: "Transact", middleware: "IRIS", authentication: "OAuth", status: "Active" },
    { integration: "Core CBS Reporting", direction: "Outbound", protocol: "API", endpoint: "SMIB-Reporting", middleware: "Kafka", authentication: "MTLS", status: "Active" }
  ],

  // -------------------------------------------------------------
  // 6. PRODUCTION INCIDENT REGISTER (SMIB)
  // -------------------------------------------------------------
  productionIncidents: [
    {
      incidentId: "INC-2026-0042",
      client: "SMIB",
      siteCountry: "Sri Lanka",
      incidentDate: "04-Sep-2026 02:15",
      resolvedDate: "04-Sep-2026 03:05",
      environment: "Production",
      component: "T24/TAFJ/IRIS",
      module: "Funds Transfer",
      severity: "Critical",
      summary: "FT transactions failing for SMIB online portal",
      impact: "Branches unable to process transfers",
      symptoms: "Connection refused...",
      initialAnalysis: "DB connection pool exhausted",
      rootCauseCategory: "Infrastructure",
      rootCause: "DB connection limit reached",
      immediateResolution: "Increased connection pool",
      permanentResolution: "DB parameter + application configuration changed",
      workaround: "Restart application node",
      resolutionOwner: "Development Team",
      infraOwner: "Infra Team",
      clientContact: "SMIB IT Team",
      deploymentId: "R26.015",
      rcaRequired: "Yes",
      rcaDocument: "SharePoint link",
      preventiveAction: "Monitoring added",
      monitoringAdded: "Yes",
      knowledgeArticle: "KB-023",
      status: "Closed",
      lessonsLearned: "Connection exhaustion not monitored",
      closureApproval: "SMIB IT Manager"
    }
  ]
};

const createNaRows = (rows, valueKeys) => rows.map((row) => (
  Object.fromEntries(Object.entries(row).map(([key, value]) => [
    key,
    valueKeys.includes(key) ? 'N/A' : value
  ]))
));

export const createDefaultSiteSpecs = () => ({
  clientSiteInfo: createNaRows(smibEnvironmentData.clientSiteInfo, ['value']),
  infrastructureSpecs: createNaRows(smibEnvironmentData.infrastructureSpecs, [
    'specification', 'quantity', 'hostname', 'version', 'notes'
  ]),
  applicationTemenosSpecs: createNaRows(smibEnvironmentData.applicationTemenosSpecs, ['value']),
  databaseSpecs: createNaRows(smibEnvironmentData.databaseSpecs, ['value']),
  integrationSpecs: createNaRows(smibEnvironmentData.integrationSpecs, [
    'direction', 'protocol', 'endpoint', 'middleware', 'authentication', 'status'
  ]),
  productionIncidents: []
});