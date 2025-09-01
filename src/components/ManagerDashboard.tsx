"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { AutoFixHigh, Visibility, History } from "@mui/icons-material";
import { useAuthStore } from "@/stores/authStore";

export default function ManagerDashboard() {
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const hebrewDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  // Mock data for demonstration
  const workers = [
    { id: "1", name: "דני כהן" },
    { id: "2", name: "שרה לוי" },
    { id: "3", name: "יוסי אברהם" },
  ];

  const positions = [
    "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י",
    "20", "516", "בישרון 11", "בישרון 17", "39 א", "39 ב", "סיור 10"
  ];

  const mockShifts = [
    { id: "1", date: "2024-01-15", position: "א", worker: "דני כהן", time: "08:00-16:00" },
    { id: "2", date: "2024-01-15", position: "ב", worker: "שרה לוי", time: "16:00-00:00" },
    { id: "3", date: "2024-01-16", position: "ג", worker: "יוסי אברהם", time: "08:00-16:00" },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const generateNextWeekAssignments = () => {
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
      alert("שיבוצים נוצרו בהצלחה!");
    }, 2000);
  };

  const renderCurrentWeek = () => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">השבוע הנוכחי</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Visibility />}
            size="small"
          >
            צפייה
          </Button>
          <Button
            variant="outlined"
            startIcon={<History />}
            size="small"
          >
            היסטוריה
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>תאריך</TableCell>
              <TableCell>עמדה</TableCell>
              <TableCell>עובד</TableCell>
              <TableCell>שעות</TableCell>
              <TableCell>סטטוס</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockShifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>{new Date(shift.date).toLocaleDateString("he-IL")}</TableCell>
                <TableCell>{shift.position}</TableCell>
                <TableCell>{shift.worker}</TableCell>
                <TableCell>{shift.time}</TableCell>
                <TableCell>
                  <Chip label="מאושר" color="success" size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderNextWeek = () => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">השבוע הבא</Typography>
        <Button
          variant="contained"
          startIcon={<AutoFixHigh />}
          onClick={generateNextWeekAssignments}
          disabled={isGenerating}
          color="primary"
        >
          {isGenerating ? "מייצר שיבוצים..." : "ייצור שיבוצים אוטומטי"}
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          השיבוצים לשבוע הבא יווצרו אוטומטיטי על בסיס זמינות העובדים והאילוצים שהוגדרו.
        </Typography>
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            סיכום עמדות ועובדים
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>עמדות זמינות:</Typography>
              <Typography variant="body2" color="textSecondary">
                {positions.length} עמדות פעילות
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>עובדים זמינים:</Typography>
              <Typography variant="body2" color="textSecondary">
                {workers.length} עובדים פעילים
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ p: 2 }} dir="rtl">
      <Typography variant="h4" sx={{ mb: 3, color: "blue" }}>
        ניהול שיבוצים - {user?.name}
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="השבוע הנוכחי" />
        <Tab label="השבוע הבא" />
      </Tabs>

      <Box>
        {tabValue === 0 && renderCurrentWeek()}
        {tabValue === 1 && renderNextWeek()}
      </Box>
    </Box>
  );
}
