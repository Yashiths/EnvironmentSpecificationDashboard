import React, { useState } from 'react';
import { SimpleHeader } from '../components/layout/SimpleHeader';
import { TabBar } from '../components/layout/TabBar';

import { ClientInfo } from '../components/ClientInfo';
import { InfraSpecTable } from '../components/tables/InfraSpecTable';
import { TemenosSpecTable } from '../components/tables/TemenosSpecTable';
import { DbSpecTable } from '../components/tables/DbSpecTable';
import { IntegrationSpecTable } from '../components/tables/IntegrationSpecTable';
import { ProductionIncidentRegister as IncidentRegister } from '../components/ProductionIncidentRegister';

export const UserPortal = () => {
  const [activeTab, setActiveTab] = useState('client-info');

  const renderActiveTable = () => {
    switch (activeTab) {
      case 'client-info':
        return <ClientInfo readOnly={true} />;
      case 'infrastructure':
        return <InfraSpecTable readOnly={true} />;
      case 'app-specs':
        return <TemenosSpecTable readOnly={true} />;
      case 'db-specs':
        return <DbSpecTable readOnly={true} />;
      case 'integrations':
        return <IntegrationSpecTable readOnly={true} />;
      case 'incidents':
        return <IncidentRegister readOnly={true} />;
      default:
        return <ClientInfo readOnly={true} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans flex flex-col">
      {/* Simple Top Header */}
      <SimpleHeader isAdminPortal={false} />

      <div className="flex flex-1 flex-col lg:flex-row min-w-0">
        {/* Vertical specification navigation */}
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Table Viewer Area */}
        <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8">
          {renderActiveTable()}
        </main>
      </div>
    </div>
  );
};
