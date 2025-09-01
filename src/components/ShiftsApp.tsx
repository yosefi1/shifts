import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Box from "@mui/material/Box";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Workers from "./Workers";
import Shifts from "./Shifts";
import Constraints from "./Constraints";
import Preferences from "./Preferences";

export default function ShiftsApp() {
  const [currentView, setCurrentView] = useState("dashboard");

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
        return <Shifts />;
      case "constraints":
        return <Constraints />;
      case "preferences":
        return <Preferences />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
          <Header />
          <Box sx={{ display: "flex" }}>
            <Sidebar currentView={currentView} onViewChange={setCurrentView} />
            <Box sx={{ flex: 1, p: 3 }}>{renderView()}</Box>
          </Box>
          <Toaster position="top-right" />
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
}


