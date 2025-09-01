"use client";

import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import ManagerDashboard from './ManagerDashboard';
import Workers from './Workers';
import Shifts from './Shifts';
import Constraints from './Constraints';
import Preferences from './Preferences';
import { useAuthStore } from '@/stores/authStore';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const queryClient = new QueryClient();

export default function ShiftsApp() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, isLoading } = useAuthStore();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'shifts':
        // Show ManagerDashboard for managers when viewing shifts
        return user?.role === 'manager' ? <ManagerDashboard /> : <Shifts />;
      case 'workers':
        return <Workers />;
      case 'constraints':
        return <Constraints />;
      case 'preferences':
        return <Preferences />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">טוען... Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex items-center justify-center h-screen">
              <div className="text-lg">יש להתחבר למערכת</div>
            </div>
          </div>
          <Toaster position="top-right" />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex">
            <Sidebar 
              currentView={currentView} 
              onViewChange={setCurrentView}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <main className="flex-1 p-6">
              {renderCurrentView()}
            </main>
          </div>
          <Toaster position="top-right" />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}