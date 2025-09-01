"use client";

import { Box, Typography, Button } from "@mui/material";
import { Dashboard, Schedule, People, ExitToApp } from "@mui/icons-material";
import { useAuthStore } from "@/stores/authStore";

type SidebarProps = {
  currentView: string;
  onViewChange: (key: string) => void;
};

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const menuItems = user?.role === 'manager' ? [
    { key: 'dashboard', text: 'דשבורד', icon: <Dashboard /> },
    { key: 'manager-dashboard', text: 'ניהול שיבוצים', icon: <Schedule /> },
    { key: 'workers', text: 'עובדים', icon: <People /> },
    { key: 'shifts', text: 'שיבוצים', icon: <Schedule /> }
  ] : [
    { key: 'dashboard', text: 'דשבורד', icon: <Dashboard /> },
    { key: 'availability', text: 'איולוצי', icon: <Schedule /> },
    { key: 'shifts', text: 'שיבוצים', icon: <Schedule /> }
  ];

  return (
    <Box
      sx={{
        width: 250,
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* User Info */}
      <Box
        sx={{
          padding: '20px',
          borderBottom: '1px solid #34495e',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {user?.name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#bdc3c7' }}>
          {user?.role === 'manager' ? 'מנהל' : 'עובד'}
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <Box
            key={item.key}
            onClick={() => onViewChange(item.key)}
            sx={{
              padding: '15px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              backgroundColor: currentView === item.key ? '#34495e' : 'transparent',
              borderLeft: currentView === item.key ? '4px solid #3498db' : '4px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#34495e',
              },
            }}
          >
            {item.icon}
            <Typography>{item.text}</Typography>
          </Box>
        ))}
      </Box>

      {/* Logout Button */}
      <Box sx={{ padding: '20px', borderTop: '1px solid #34495e' }}>
        <Button
          onClick={handleLogout}
          sx={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#e74c3c',
            color: 'white',
            '&:hover': {
              backgroundColor: '#c0392b',
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <ExitToApp />
          התנתק
        </Button>
      </Box>
    </Box>
  );
}


