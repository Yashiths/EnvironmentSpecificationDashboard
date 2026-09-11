import React, { useState } from 'react';
import { ClientNavbar } from './ClientNavbar';
import { ClientSidebar } from './ClientSidebar';

import { OverviewView } from '../views/OverviewView';
import { IncidentsView } from '../views/IncidentsView';
import { ClientInfoView } from '../views/ClientInfoView';
import { InfraSpecView } from '../views/InfraSpecView';
import { AppSpecView } from '../views/AppSpecView';
import { DbSpecView } from '../views/DbSpecView';
import { IntegrationView } from '../views/IntegrationView';
import { RcaKbView } from '../views/RcaKbView';

export const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView setActiveTab={setActiveTab} readOnly={true} />;
      case 'incidents':
        return <IncidentsView searchQuery={searchQuery} readOnly={true} />;
      case 'client-info':
        return <ClientInfoView readOnly={true} />;
      case 'infrastructure':
        return <InfraSpecView searchQuery={searchQuery} readOnly={true} />;
      case 'app-specs':
        return <AppSpecView searchQuery={searchQuery} readOnly={true} />;
      case 'db-specs':
        return <DbSpecView readOnly={true} />;
      case 'integrations':
        return <IntegrationView searchQuery={searchQuery} readOnly={true} />;
      case 'rca-kb':
        return <RcaKbView searchQuery={searchQuery} readOnly={true} />;
      default:
        return <OverviewView setActiveTab={setActiveTab} readOnly={true} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans flex flex-col">
      {/* Client Top Navbar */}
      <ClientNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Client Sidebar */}
        <ClientSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
