"use client";

import { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";

// Shift types and their hours
const SHIFT_TYPES = {
  morning: { name: "בוקר", hours: "08:00-12:00", start: 8, end: 12 },
  evening: { name: "ערב", hours: "20:00-00:00", start: 20, end: 24 },
  night: { name: "לילה", hours: "00:00-04:00", start: 0, end: 4 },
};

// Days of the week
const DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

export default function Shifts() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentWeekType, setCurrentWeekType] = useState("morning");
  const [shifts, setShifts] = useState<any>({});
  const [message, setMessage] = useState("");

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Error loading users:', error);
        setMessage("שגיאה בטעינת רשימת העובדים");
      }
    };

    loadUsers();
  }, []);

  // Initialize shifts structure
  useEffect(() => {
    if (users.length > 0) {
      initializeShifts();
    }
  }, [users, currentWeekType]);

  const initializeShifts = () => {
    const newShifts: any = {};
    
    DAYS.forEach(day => {
      newShifts[day] = {
        morning: { assigned: null, available: getAvailableWorkers(day, "morning") },
        evening: { assigned: null, available: getAvailableWorkers(day, "evening") },
        night: { assigned: null, available: getAvailableWorkers(day, "night") },
      };
    });
    
    setShifts(newShifts);
  };

  // Get available workers for a specific day and shift
  const getAvailableWorkers = (day: string, shiftType: string) => {
    return users.filter(user => {
      // Skip manager
      if (user.role === "manager") return false;
      
      // Check Shabbat restrictions
      if (day === "שישי" || day === "שבת") {
        if (user.keepShabbat) return false;
      }
      
      // For now, return all available workers
      // Later we'll add more sophisticated filtering
      return true;
    });
  };

  // Handle shift assignment
  const handleShiftAssignment = (day: string, shiftType: string, userId: string | null) => {
    setShifts(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [shiftType]: {
          ...prev[day][shiftType],
          assigned: userId,
        }
      }
    }));
  };

  // Auto-assign shifts
  const handleAutoAssign = () => {
    // This will be implemented in the next step
    setMessage("שיבוץ אוטומטי יושק בקרוב!");
  };

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <Box sx={{ p: 3 }} dir="rtl">
      <Typography variant="h4" sx={{ textAlign: "center", mb: 4, color: "#333" }}>
        ניהול שיבוצים
      </Typography>

      {/* Week Type Selection */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            סוג שבוע נוכחי
          </Typography>
          <FormControl fullWidth>
            <InputLabel>סוג שבוע</InputLabel>
            <Select
              value={currentWeekType}
              onChange={(e) => setCurrentWeekType(e.target.value)}
              label="סוג שבוע"
            >
              <MenuItem value="morning">בוקר (08:00-12:00)</MenuItem>
              <MenuItem value="evening">ערב (20:00-00:00)</MenuItem>
              <MenuItem value="night">לילה (00:00-04:00)</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            השבוע הבא יזוז ב-4 שעות אוטומטית
          </Typography>
        </CardContent>
      </Card>

      {/* Message */}
      {message && (
        <Alert
          severity={message.includes("שגיאה") ? "error" : "success"}
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleAutoAssign}
          sx={{ mr: 2 }}
        >
          שיבוץ אוטומטי
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={initializeShifts}
        >
          נקה שיבוצים
        </Button>
      </Box>

      {/* Shifts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
              <TableCell align="right">יום</TableCell>
              <TableCell align="center">בוקר (08:00-12:00)</TableCell>
              <TableCell align="center">ערב (20:00-00:00)</TableCell>
              <TableCell align="center">לילה (00:00-04:00)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {DAYS.map((day) => (
              <TableRow key={day}>
                <TableCell align="right">
                  <Typography variant="body1" fontWeight="bold">
                    {day}
                  </Typography>
                  {day === "שישי" && (
                    <Chip label="שומרי שבת לא זמינים" size="small" color="warning" />
                  )}
                  {day === "שבת" && (
                    <Chip label="שומרי שבת לא זמינים" size="small" color="warning" />
                  )}
                </TableCell>
                
                {/* Morning Shift */}
                <TableCell align="center">
                  <FormControl fullWidth size="small">
                    <Select
                      value={shifts[day]?.morning?.assigned || ""}
                      onChange={(e) => handleShiftAssignment(day, "morning", e.target.value || null)}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>בחר עובד</em>
                      </MenuItem>
                      {shifts[day]?.morning?.available?.map((user: any) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name} ({user.id})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>

                {/* Evening Shift */}
                <TableCell align="center">
                  <FormControl fullWidth size="small">
                    <Select
                      value={shifts[day]?.evening?.assigned || ""}
                      onChange={(e) => handleShiftAssignment(day, "evening", e.target.value || null)}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>בחר עובד</em>
                      </MenuItem>
                      {shifts[day]?.evening?.available?.map((user: any) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name} ({user.id})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>

                {/* Night Shift */}
                <TableCell align="center">
                  <FormControl fullWidth size="small">
                    <Select
                      value={shifts[day]?.night?.assigned || ""}
                      onChange={(e) => handleShiftAssignment(day, "night", e.target.value || null)}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>בחר עובד</em>
                      </MenuItem>
                      {shifts[day]?.night?.available?.map((user: any) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name} ({user.id})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}