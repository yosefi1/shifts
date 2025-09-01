"use client";

import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Divider, IconButton } from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  People as PeopleIcon, 
  Schedule as ScheduleIcon, 
  Block as BlockIcon, 
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useAuthStore } from "@/stores/authStore";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'workers', label: 'Workers', icon: <PeopleIcon /> },
  { id: 'shifts', label: 'Shifts', icon: <ScheduleIcon /> },
  { id: 'constraints', label: 'Constraints', icon: <BlockIcon /> },
  { id: 'preferences', label: 'Preferences', icon: <SettingsIcon /> },
];

export default function Sidebar({ currentView, onViewChange, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? 60 : 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? 60 : 240,
          boxSizing: 'border-box',
          marginTop: '64px', // Account for header height
          transition: 'width 0.3s ease',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Toggle button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={onToggleCollapse} size="small">
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
        
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={currentView === item.id}
                onClick={() => onViewChange(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {!isCollapsed && <ListItemText primary={item.label} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ marginTop: 'auto' }}>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} title={isCollapsed ? "התנתקות" : undefined}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                {!isCollapsed && <ListItemText primary="התנתקות" />}
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}