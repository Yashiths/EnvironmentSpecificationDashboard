import React, { useState } from 'react';
import { AdminNavbar } from './AdminNavbar';
import { AdminSidebar } from './AdminSidebar';

import { OverviewView } from '../views/OverviewView';
import { IncidentsView } from '../views/IncidentsView';
import { ClientInfoView } from '../views/ClientInfoView';
import { InfraSpecView } from '../views/InfraSpecView';
import { AppSpecView } from '../views/AppSpecView';
import { DbSpecView } from '../views/DbSpecView';
import { IntegrationView } from '../views/IntegrationView';
import { RcaKbView } from '../views/RcaKbView';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView setActiveTab={setActiveTab} readOnly={false} />;
      case 'incidents':
        return <IncidentsView searchQuery={searchQuery} readOnly={false} />;
      case 'client-info':
        return <ClientInfoView readOnly={false} />;
      case 'infrastructure':
        return <InfraSpecView searchQuery={searchQuery} readOnly={false} />;
      case 'app-specs':
        return <AppSpecView searchQuery={searchQuery} readOnly={false} />;
      case 'db-specs':
        return <DbSpecView readOnly={false} />;
      case 'integrations':
        return <IntegrationView searchQuery={searchQuery} readOnly={false} />;
      case 'rca-kb':
        return <RcaKbView searchQuery={searchQuery} readOnly={false} />;
      default:
        return <OverviewView setActiveTab={setActiveTab} readOnly={false} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans flex flex-col">
      {/* Admin Top Navbar */}
      <AdminNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Admin Sidebar */}
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* View Content with CRUD Enabled */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
