"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { useAuthStore } from "@/stores/authStore";

export default function Shifts() {
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);

  // Mock shifts data
  const mockShifts = [
    {
      id: "1",
      workerId: user?.id,
      station: "קבלה",
      date: "2024-01-15",
      startTime: "08:00",
      endTime: "16:00",
      status: "upcoming",
    },
    {
      id: "2",
      workerId: user?.id,
      station: "מעבדה",
      date: "2024-01-16",
      startTime: "16:00",
      endTime: "00:00",
      status: "upcoming",
    },
    {
      id: "3",
      workerId: user?.id,
      station: "חדר ניתוח",
      date: "2024-01-10",
      startTime: "07:00",
      endTime: "15:00",
      status: "past",
    },
    {
      id: "4",
      workerId: user?.id,
      station: "מיון",
      date: new Date().toISOString().split("T")[0],
      startTime: "12:00",
      endTime: "20:00",
      status: "today",
    },
  ];

  const userShifts = mockShifts.filter((shift) => shift.workerId === user?.id);
  const upcomingShifts = userShifts.filter((shift) => shift.status === "upcoming");
  const todayShifts = userShifts.filter((shift) => shift.status === "today");
  const pastShifts = userShifts.filter((shift) => shift.status === "past");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderShiftList = (shiftList: typeof userShifts, statusColor: "primary" | "success" | "default") => {
    if (shiftList.length === 0) {
      return (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography align="center" color="textSecondary">
              אין משמרות
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Box sx={{ mt: 2 }}>
        {shiftList.map((shift) => (
          <Card key={shift.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="h6">{shift.station}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(shift.date).toLocaleDateString("he-IL")} | {shift.startTime} - {shift.endTime}
                  </Typography>
                </Box>
                <Chip
                  label={
                    shift.status === "upcoming"
                      ? "קרוב"
                      : shift.status === "today"
                      ? "היום"
                      : "עבר"
                  }
                  color={statusColor}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 2 }} dir="rtl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        המשמרות שלי
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="קרובות" />
        <Tab label="היום" />
        <Tab label="עבר" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {tabValue === 0 && renderShiftList(upcomingShifts, "primary")}
        {tabValue === 1 && renderShiftList(todayShifts, "success")}
        {tabValue === 2 && renderShiftList(pastShifts, "default")}
      </Box>
    </Box>
  );
}