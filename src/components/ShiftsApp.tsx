"use client";

import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Box from "@mui/material/Box";
import { useAuthStore } from "@/stores/authStore";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Sidebar from "./Sidebar";
import Workers from "./Workers";
import Shifts from "./Shifts";
import Constraints from "./Constraints";
import Preferences from "./Preferences";
import ManagerDashboard from "./ManagerDashboard";

export default function ShiftsApp() {
  const [currentView, setCurrentView] = useState("dashboard");
  const { user, isLoading, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const theme = createTheme({
    direction: "rtl",
    palette: { primary: { main: "#1976d2" }, secondary: { main: "#dc004e" } },
  });

  const queryClient = new QueryClient();

  const renderView = () => {
    switch (currentView) {
      case "workers":
        return <Workers />;
      case "shifts":
        // For managers, show shift management; for workers, show personal shifts
        return user?.role === "manager" ? <ManagerDashboard /> : <Shifts />;
      case "constraints":
        return <Constraints />;
      case "preferences":
        return <Preferences />;
      case "availability":
        return <Constraints />; // Reuse for now
      case "manager-dashboard":
        return <ManagerDashboard />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        טוען... Loading...
      </Box>
    );
  }

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Login />
          <Toaster position="top-right" />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar currentView={currentView} onViewChange={setCurrentView} />
          <Box sx={{ flex: 1, padding: "20px", backgroundColor: "#f5f6fa" }}>
            {renderView()}
          </Box>
          <Toaster position="top-right" />
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
}


