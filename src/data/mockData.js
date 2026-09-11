import { smibEnvironmentData } from '../../mockData.js';

export const CLIENTS = [
  { id: 'SMIB', name: 'SMIB (State Mortgage & Investment Bank)', code: 'SMIB-PROD', country: 'United States' },
  { id: 'NBL', name: 'National Banking Limited', code: 'NBL-ENTERPRISE', country: 'Switzerland' },
  { id: 'NDBP', name: 'National Digital Banking Platform', code: 'NDBP-CLOUD', country: 'United Kingdom' }
];

export const INITIAL_MOCK_DATA = {
  SMIB: {
    clientSiteInfo: smibEnvironmentData.clientSiteInfo,
    infrastructureSpecs: smibEnvironmentData.infrastructureSpecs,
    applicationTemenosSpecs: smibEnvironmentData.applicationTemenosSpecs,
    databaseSpecs: smibEnvironmentData.databaseSpecs,
    integrationSpecs: smibEnvironmentData.integrationSpecs,
    productionIncidents: smibEnvironmentData.productionIncidents,
    clientInfo: {
      client: 'SMIB (State Mortgage & Investment Bank)',
      country: 'United States (East / West Region)',
      site: 'DC-East Primary & DR-West Datacenter',
      environment: 'Production (HA Cluster)',
      goLiveDate: '2022-04-15',
      owner: 'Sarah Jenkins (DevOps Lead / s.jenkins@smib-bank.com)',
      supportContact: 'L3 On-Call Ops (+1 800-555-0199)',
      licenseTier: 'Tier 1 Enterprise License'
    },
    infrastructure: [
      {
        id: 'INF-01',
        component: 'Application Server Node 01',
        spec: '32 vCPU, 64 GB DDR5 RAM, RHEL 9.3 LTS',
        quantity: '2 Active Nodes',
        hostname: 'smib-app-prod-01.internal',
        version: 'WildFly 27.0.1 / Java 17 LTS',
        notes: 'Primary J2EE host behind HAProxy load balancer'
      },
      {
        id: 'INF-02',
        component: 'PostgreSQL Database Master',
        spec: '64 vCPU, 256 GB RAM, 4.0 TB Enterprise NVMe',
        quantity: '3 Cluster Nodes',
        hostname: 'smib-db-master.internal',
        version: 'PostgreSQL 15.4 (Patroni HA 3.0.1)',
        notes: 'Synchronous streaming replication with automatic failover'
      },
      {
        id: 'INF-03',
        component: 'Redis Session Cache',
        spec: '16 vCPU, 64 GB RAM, 100 GB SSD',
        quantity: '6 Cluster Nodes',
        hostname: 'smib-redis-prod.internal',
        version: 'Redis v7.2 Sentinel',
        notes: 'In-memory state storage for balance caching & teller sessions'
      },
      {
        id: 'INF-04',
        component: 'Apache Kafka Event Broker',
        spec: '24 vCPU, 96 GB RAM, 2.0 TB NVMe',
        quantity: '3 Broker Nodes',
        hostname: 'smib-kafka-prod.internal',
        version: 'Kafka v3.6.1 (KRaft mode)',
        notes: 'Real-time account event streaming & push notification bus'
      }
    ],
    appSpecs: {
      temenosProduct: 'Temenos Transact Enterprise Edition',
      release: 'R22.00.04 (Build 2026.04.18)',
      tafjVersion: 'TAFJ 2022.08.01 (Java 17 LTS Runtime)',
      irisVersion: 'IRIS API Gateway v4.18.2-GA',
      javaVersion: 'OpenJDK 17.0.9 (64-Bit Server VM)',
      nodes: '4 Active-Active Worker Nodes',
      cicdTool: 'GitLab CI / Jenkins Pipeline & Ansible Playbooks',
      deploymentPath: '/opt/temenos/transact/R22_PROD'
    },
    dbSpecs: [
      { parameter: 'Database Engine', value: 'PostgreSQL Enterprise Edition' },
      { parameter: 'Version / Patchset', value: '15.4 (Patroni HA 3.0.1)' },
      { parameter: 'DB Host / Instance', value: 'smib-db-master.internal (Instance: SMIB_PROD_CBS)' },
      { parameter: 'Port', value: '5432' },
      { parameter: 'vCPU Allocation', value: '64 vCPU' },
      { parameter: 'Memory / RAM', value: '256 GB DDR5 RAM (64 GB Shared Buffers)' },
      { parameter: 'Storage Capacity', value: '4,000 GB Enterprise NVMe (30,000 IOPS)' },
      { parameter: 'Storage Used', value: '1,840 GB (46% utilized)' },
      { parameter: 'Backup Retention & Strategy', value: 'PgBackRest Continuous WAL Archiving + Daily Full (14-Day PITR Retention)' },
      { parameter: 'Maintenance Window', value: 'Sundays 02:00 UTC - 04:00 UTC' }
    ],
    integrations: [
      {
        id: 'INT-01',
        name: 'Central Bank ACH Gateway',
        direction: 'Outbound / Inbound',
        protocol: 'REST / HTTPS (Mutual TLS)',
        endpoint: 'https://ach-gateway.centralbank.gov/v2/clearing',
        middleware: 'Integration Framework (TCIB Hub)',
        authentication: 'OAuth2 + X.509 Client Certificate',
        status: 'Active'
      },
      {
        id: 'INT-02',
        name: 'SWIFT Alliance Messaging Broker',
        direction: 'Bi-directional',
        protocol: 'ISO 20022 / MQ Series',
        endpoint: 'mq://swift-broker.smib-bank.com:1414/SWIFT.OUT',
        middleware: 'IBM MQ v9.3',
        authentication: 'Hardware Security Module (HSM) Signing',
        status: 'Active'
      },
      {
        id: 'INT-03',
        name: 'Credit Bureau Rating API',
        direction: 'Outbound',
        protocol: 'SOAP / XML WebServices',
        endpoint: 'https://api.creditbureau.org/soap/score/v3',
        middleware: 'IRIS API Gateway',
        authentication: 'WS-Security API Key Token',
        status: 'Degraded'
      },
      {
        id: 'INT-04',
        name: 'SMS Notification Gateway',
        direction: 'Outbound',
        protocol: 'REST / JSON',
        endpoint: 'https://api.infobip.com/sms/2/text/single',
        middleware: 'Node.js Microservice Proxy',
        authentication: 'Bearer JWT Token',
        status: 'Active'
      }
    ],
    incidents: smibEnvironmentData.productionIncidents.map((incident) => ({
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
  },
  NBL: {
    clientInfo: {
      client: 'National Banking Limited',
      country: 'Switzerland / AWS Frankfurt Region',
      site: 'AWS eu-central-1 (Primary) & Zurich On-Prem (DR)',
      environment: 'Production (Hybrid Cloud)',
      goLiveDate: '2023-01-20',
      owner: 'Markus Weber (Head of Infra / m.weber@nbl-bank.ch)',
      supportEscalation: '24/7 Operations (+41 44 999 2000)',
      licenseTier: 'Tier 1 Global Cloud License'
    },
    infrastructure: [
      {
        id: 'INF-NBL-01',
        component: 'Temenos Transact Node Pool',
        spec: '48 vCPU, 128 GB RAM per node',
        quantity: '4 Kubernetes Pods',
        hostname: 'ip-10-100-4-50.eu-central-1.compute.internal',
        version: 'Amazon Linux 2023 Container Host',
        notes: 'EKS Cluster autoscaled across 3 AWS Availability Zones'
      },
      {
        id: 'INF-NBL-02',
        component: 'Oracle RAC 19c Database Cluster',
        spec: '128 vCPU, 512 GB RAM, 12 TB SAN Storage',
        quantity: '2 RAC Nodes',
        hostname: 'nbl-ora-rac-01.nbl.ch',
        version: 'Oracle Linux 8.8 Enterprise / Exadata X9M',
        notes: 'Automatic Storage Management (ASM) & High Speed Infiniband Interconnect'
      }
    ],
    appSpecs: {
      temenosProduct: 'Temenos Transact Global Edition',
      release: 'R23.00.01 (Build 2026.06.30)',
      tafjVersion: 'TAFJ 2023.04.00 (Java 21 LTS)',
      irisVersion: 'IRIS Microservices Gateway v5.0.1',
      javaVersion: 'Eclipse Temurin OpenJDK 21.0.1',
      nodes: '6 Pod Replica Sets in EKS',
      cicdTool: 'ArgoCD / Helm & GitHub Actions Enterprise',
      deploymentPath: '/opt/app/temenos/R23'
    },
    dbSpecs: [
      { parameter: 'Database Engine', value: 'Oracle Real Application Clusters (RAC)' },
      { parameter: 'Version / Patchset', value: '19c (19.20.0.0.0 Enterprise)' },
      { parameter: 'DB Host / Instance', value: 'nbl-ora-rac-01.nbl.ch (SID: NBLCBSPROD)' },
      { parameter: 'Port', value: '1521' },
      { parameter: 'vCPU Allocation', value: '128 vCPU per node' },
      { parameter: 'Memory / RAM', value: '512 GB RAM per node (200 GB SGA / 50 GB PGA)' },
      { parameter: 'Storage Capacity', value: '12,000 GB ASM Storage' },
      { parameter: 'Storage Used', value: '5,890 GB (49% utilized)' },
      { parameter: 'Backup Retention & Strategy', value: 'RMAN Continuous Incremental + Active Dataguard Standby' },
      { parameter: 'Maintenance Window', value: 'Saturdays 23:00 UTC - 01:00 UTC' }
    ],
    integrations: [
      {
        id: 'INT-NBL-01',
        name: 'SEPA Instant Credit Transfer Gateway',
        direction: 'Bi-directional',
        protocol: 'ISO 20022 XML / WebServices',
        endpoint: 'https://sepa-instant.nbl-bank.ch/api/v1/transfer',
        middleware: 'EBA CLEARING RT1 Adapter',
        authentication: 'PKI Certificate + Signed Token',
        status: 'Active'
      }
    ],
    incidents: []
  },
  NDBP: {
    clientInfo: {
      client: 'National Digital Banking Platform',
      country: 'United Kingdom / GCP & AWS Cloud',
      site: 'Google Cloud europe-west1 & AWS eu-west-1',
      environment: 'Production (Cloud Native Multi-Cloud)',
      goLiveDate: '2024-09-01',
      owner: 'Anya Petrov (VP of Platform / a.petrov@ndbp-digital.com)',
      supportEscalation: 'SRE On-Call (#sre-critical / PagerDuty)',
      licenseTier: 'Tier 1 Digital Native License'
    },
    infrastructure: [
      {
        id: 'INF-NDBP-01',
        component: 'GKE Autopilot Kubernetes Node Pool',
        spec: '96 vCPU, 384 GB RAM, 2.0 TB NVMe Local SSD',
        quantity: '8 Autoscaled Nodes',
        hostname: 'gke-ndbp-prod-pool-1-a8b2',
        version: 'Google Container-Optimized OS',
        notes: 'Zero-downtime rolling node upgrades'
      }
    ],
    appSpecs: {
      temenosProduct: 'Temenos Transact Digital Native',
      release: 'R23.01.00 (Build 2026.07.12)',
      tafjVersion: 'TAFJ Cloud Container Edition',
      irisVersion: 'IRIS Cloud Gateway v5.2.0',
      javaVersion: 'GraalVM Native Image Java 21',
      nodes: '12 Serverless Container Instances',
      cicdTool: 'Terraform & GitHub Actions Workflows',
      deploymentPath: '/docker/apps/transact'
    },
    dbSpecs: [
      { parameter: 'Database Engine', value: 'CockroachDB Distributed SQL' },
      { parameter: 'Version / Patchset', value: 'v23.2.4 Multi-Region' },
      { parameter: 'DB Host / Instance', value: 'cockroach.ndbp-digital.internal' },
      { parameter: 'Port', value: '26257' },
      { parameter: 'vCPU Allocation', value: '96 vCPU Distributed' },
      { parameter: 'Memory / RAM', value: '384 GB RAM (128 GB Block Cache)' },
      { parameter: 'Storage Capacity', value: '8,000 GB NVMe Storage' },
      { parameter: 'Storage Used', value: '2,410 GB (30% utilized)' },
      { parameter: 'Backup Retention & Strategy', value: 'Continuous Cloud Storage Snapshotting (Zero RPO)' },
      { parameter: 'Maintenance Window', value: 'Zero-Downtime Rolling Maintenance' }
    ],
    integrations: [
      {
        id: 'INT-NDBP-01',
        name: 'Mastercard Debit Processing Network',
        direction: 'Bi-directional',
        protocol: 'REST / JSON API',
        endpoint: 'https://api.mastercard.com/digital/payments/v2',
        middleware: 'Payment Microservices Gateway',
        authentication: 'OAuth 1.0a + RSA Signature',
        status: 'Active'
      }
    ],
    incidents: []
  }
};
