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

// Types
interface User {
  id: string;
  name: string;
  role: string;
  gender: string;
  keepShabbat: boolean;
}

interface Shift {
  assigned: string | null;
  available: User[];
  workers: User[]; // List of workers assigned to this shift
}

interface DayShifts {
  first: Shift;
  second: Shift;
  [key: string]: Shift; // Add index signature
}

interface ShiftsState {
  [day: string]: DayShifts;
}

// Shift types and their hours - 2 shifts per day with 12 hour difference
const SHIFT_TYPES = {
  first: { name: "משמרת ראשונה", hours: "08:00-12:00", start: 8, end: 12 },
  second: { name: "משמרת שנייה", hours: "20:00-00:00", start: 20, end: 24 },
};

// Days of the week
const DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

export default function Shifts() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentWeekType, setCurrentWeekType] = useState("first");
  const [shifts, setShifts] = useState<ShiftsState>({});
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
    const newShifts: ShiftsState = {};
    
    DAYS.forEach(day => {
      newShifts[day] = {
        first: { assigned: null, available: getAvailableWorkers(day, "first"), workers: [] },
        second: { assigned: null, available: getAvailableWorkers(day, "second"), workers: [] },
      };
    });
    
    setShifts(newShifts);
  };

  // Get available workers for a specific day and shift
  const getAvailableWorkers = (day: string, shiftType: string): User[] => {
    return users.filter((user: User) => {
      // Skip manager
      if (user.role === "manager") return false;
      
      // Check Shabbat restrictions
      if (day === "שישי" || day === "שבת") {
        if (user.keepShabbat) return false;
      }
      
      // Check if worker is already assigned to this day (any shift)
      const dayShifts = shifts[day];
      if (dayShifts) {
        const alreadyAssigned = dayShifts.first.workers.some(w => w.id === user.id) ||
                               dayShifts.second.workers.some(w => w.id === user.id);
        if (alreadyAssigned) return false;
      }
      
      return true;
    });
  };

  // Handle shift assignment
  const handleShiftAssignment = (day: string, shiftType: string, userId: string | null) => {
    if (!userId) {
      // Remove worker from shift
      setShifts((prev: ShiftsState) => ({
        ...prev,
        [day]: {
          ...prev[day],
          [shiftType]: {
            ...prev[day][shiftType],
            assigned: null,
            workers: [],
          }
        }
      }));
      return;
    }

    // Add worker to shift
    const worker = users.find(u => u.id === userId);
    if (!worker) return;

    setShifts((prev: ShiftsState) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [shiftType]: {
          ...prev[day][shiftType],
          assigned: userId,
          workers: [worker],
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
               <MenuItem value="first">משמרת ראשונה (08:00-12:00)</MenuItem>
               <MenuItem value="second">משמרת שנייה (20:00-00:00)</MenuItem>
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
               <TableCell align="center">משמרת ראשונה (08:00-12:00)</TableCell>
               <TableCell align="center">משמרת שנייה (20:00-00:00)</TableCell>
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
                
                                 {/* First Shift */}
                 <TableCell align="center">
                   <Box>
                     {/* Show assigned workers */}
                     {shifts[day]?.first?.workers?.map((worker: User) => (
                       <Box key={worker.id} sx={{ mb: 1, p: 1, bgcolor: 'primary.light', borderRadius: 1 }}>
                         <Typography variant="body2" color="white">
                           {worker.name} ({worker.id})
                         </Typography>
                         <Button
                           size="small"
                           variant="outlined"
                           color="error"
                           onClick={() => handleShiftAssignment(day, "first", null)}
                           sx={{ mt: 0.5 }}
                         >
                           הסר
                         </Button>
                       </Box>
                     ))}
                     
                     {/* Add worker dropdown */}
                     {(!shifts[day]?.first?.workers || shifts[day]?.first?.workers.length === 0) && (
                       <FormControl fullWidth size="small">
                         <Select
                           value=""
                           onChange={(e) => handleShiftAssignment(day, "first", e.target.value || null)}
                           displayEmpty
                         >
                           <MenuItem value="">
                             <em>בחר עובד</em>
                           </MenuItem>
                           {getAvailableWorkers(day, "first").map((user: User) => (
                             <MenuItem key={user.id} value={user.id}>
                               {user.name} ({user.id})
                             </MenuItem>
                           ))}
                         </Select>
                       </FormControl>
                     )}
                   </Box>
                 </TableCell>

                 {/* Second Shift */}
                 <TableCell align="center">
                   <Box>
                     {/* Show assigned workers */}
                     {shifts[day]?.second?.workers?.map((worker: User) => (
                       <Box key={worker.id} sx={{ mb: 1, p: 1, bgcolor: 'secondary.light', borderRadius: 1 }}>
                         <Typography variant="body2" color="white">
                           {worker.name} ({worker.id})
                         </Typography>
                         <Button
                           size="small"
                           variant="outlined"
                           color="error"
                           onClick={() => handleShiftAssignment(day, "second", null)}
                           sx={{ mt: 0.5 }}
                         >
                           הסר
                         </Button>
                       </Box>
                     ))}
                     
                     {/* Add worker dropdown */}
                     {(!shifts[day]?.second?.workers || shifts[day]?.second?.workers.length === 0) && (
                       <FormControl fullWidth size="small">
                         <Select
                           value=""
                           onChange={(e) => handleShiftAssignment(day, "second", e.target.value || null)}
                           displayEmpty
                         >
                           <MenuItem value="">
                             <em>בחר עובד</em>
                           </MenuItem>
                           {getAvailableWorkers(day, "second").map((user: User) => (
                             <MenuItem key={user.id} value={user.id}>
                               {user.name} ({user.id})
                             </MenuItem>
                           ))}
                         </Select>
                       </FormControl>
                     )}
                   </Box>
                 </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}