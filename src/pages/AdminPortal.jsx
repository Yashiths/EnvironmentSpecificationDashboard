import React, { useState } from 'react';
import { SimpleHeader } from '../components/layout/SimpleHeader';
import { TabBar } from '../components/layout/TabBar';

import { ClientInfo } from '../components/ClientInfo';
import { InfraSpecTable } from '../components/tables/InfraSpecTable';
import { TemenosSpecTable } from '../components/tables/TemenosSpecTable';
import { DbSpecTable } from '../components/tables/DbSpecTable';
import { IntegrationSpecTable } from '../components/tables/IntegrationSpecTable';
import { IncidentRegister } from '../components/IncidentRegister';
import { UserManagement } from '../components/admin/UserManagement';
import { ClientManagement } from '../components/admin/ClientManagement';
import { AuditLogs } from '../components/admin/AuditLogs';

export const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('client-info');

  const renderActiveTable = () => {
    switch (activeTab) {
      case 'client-info':
        return <ClientInfo readOnly={false} />;
      case 'infrastructure':
        return <InfraSpecTable readOnly={false} />;
      case 'app-specs':
        return <TemenosSpecTable readOnly={false} />;
      case 'db-specs':
        return <DbSpecTable readOnly={false} />;
      case 'integrations':
        return <IntegrationSpecTable readOnly={false} />;
      case 'incidents':
        return <IncidentRegister readOnly={false} />;
      case 'user-management':
        return <UserManagement />;
      case 'client-management':
        return <ClientManagement />;
      case 'audit-logs':
        return <AuditLogs />;
      default:
        return <ClientInfo readOnly={false} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans flex flex-col">
      {/* Simple Top Header with Admin Indicator */}
      <SimpleHeader isAdminPortal={true} />

      <div className="flex flex-1 flex-col lg:flex-row min-w-0">
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Table Viewer Area with CRUD Controls */}
        <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8">
          {renderActiveTable()}
        </main>
      </div>
    </div>
  );
};
