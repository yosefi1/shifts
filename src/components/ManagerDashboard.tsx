"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import { AutoFixHigh, Visibility, History } from "@mui/icons-material";
import { useAuthStore } from "@/stores/authStore";

export default function ManagerDashboard() {
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shifts, setShifts] = useState<any[]>([]);

  // Time slot options for managers to choose from
  const timeSlotOptions = [
    { value: "morning", label: "08:00-12:00", start: "08:00", end: "12:00" },
    { value: "afternoon", label: "12:00-16:00", start: "12:00", end: "16:00" },
    { value: "evening", label: "20:00-00:00", start: "20:00", end: "00:00" },
    { value: "night", label: "00:00-04:00", start: "00:00", end: "04:00" },
    { value: "late_night", label: "04:00-08:00", start: "04:00", end: "08:00" }
  ];

  const hebrewDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת", "ראשון"];

  // Real workers from the old project
  const workers = [
    { id: "0", name: "מנהל", role: "manager" },
    { id: "8863762", name: "בן קורל", role: "worker", gender: "male", keepShabbat: true },
    { id: "8279948", name: "טל אדרי", role: "worker", gender: "male", keepShabbat: true },
    { id: "9033163", name: "ליאור אביסידריס", role: "worker", gender: "male", keepShabbat: true },
    { id: "8880935", name: "ליאל שקד", role: "worker", gender: "male", keepShabbat: true },
    { id: "8679277", name: "מאור יצחק קפון", role: "worker", gender: "male", keepShabbat: true },
    { id: "9192400", name: "מור לחמני", role: "worker", gender: "male", keepShabbat: true },
    { id: "9181564", name: "נוה חזן", role: "worker", gender: "female", keepShabbat: false },
    { id: "8379870", name: "סילנאט טזרה", role: "worker", gender: "female", keepShabbat: false },
    { id: "8783268", name: "סתיו גינה", role: "worker", gender: "male", keepShabbat: true },
    { id: "9113482", name: "עהד הזימה", role: "worker", gender: "male", keepShabbat: true },
    { id: "9113593", name: "עומרי סעד", role: "worker", gender: "male", keepShabbat: true },
    { id: "8801813", name: "קטרין בטקיס", role: "worker", gender: "female", keepShabbat: false },
    { id: "8573304", name: "רונן רזיאב", role: "worker", gender: "male", keepShabbat: true },
    { id: "5827572", name: "רפאל ניסן", role: "worker", gender: "male", keepShabbat: true },
    { id: "9147342", name: "רפאלה רזניקוב", role: "worker", gender: "female", keepShabbat: false },
    { id: "8798653", name: "שירן מוסרי", role: "worker", gender: "male", keepShabbat: true },
    { id: "9067567", name: "שרון סולימניקי", role: "worker", gender: "male", keepShabbat: true },
    { id: "8083576", name: "יקיר אלדד", role: "worker", gender: "male", keepShabbat: true }
  ];

  // Positions exactly as shown in the image - copied from the image
  const demoPositions = [
    // Main positions (Hebrew letters) - exactly as in image
    "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת",
    // Numbered positions - exactly as in image
    "20", "516", "גישרון 11", "גישרון 17", "39 א", "39 ב", "סיור 10", "סיור 10ב",
    // Special sections - exactly as in image
    "הגעה לבסיס", "יציאה הביתה", "עתודות", "אפטרים"
  ];

  // Mock constraints/availability
  const availability = [
    { id: "1", workerId: "2", date: "2024-01-15", timeSlot: "morning", isAvailable: false, note: "פגישה רפואית" },
    { id: "2", workerId: "3", date: "2024-01-16", timeSlot: "evening", isAvailable: false, note: "חופשה" },
  ];

  // Generate current and next week dates
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    return Array.from({ length: 8 }, (_, i) => {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      return date;
    });
  };

  const getNextWeekDates = () => {
    const today = new Date();
    const nextWeekStart = new Date(today.setDate(today.getDate() - today.getDay() + 7));
    return Array.from({ length: 8 }, (_, i) => {
      const date = new Date(nextWeekStart);
      date.setDate(nextWeekStart.getDate() + i);
      return date;
    });
  };

  const currentWeekDates = getCurrentWeekDates();
  const nextWeekDates = getNextWeekDates();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleWorkerChange = (shiftId: string, workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    setShifts(
      shifts.map((shift) =>
        shift.id === shiftId ? { ...shift, workerId, workerName: worker?.name || "" } : shift
      )
    );
  };

  const handleTimeSlotChange = (shiftId: string, timeSlot: string) => {
    const timeSlotOption = timeSlotOptions.find(option => option.value === timeSlot);
    if (timeSlotOption) {
      setShifts(
        shifts.map((shift) =>
          shift.id === shiftId ? { 
            ...shift, 
            timeSlot: timeSlotOption.value,
            startTime: timeSlotOption.start,
            endTime: timeSlotOption.end
          } : shift
        )
      );
    }
  };

  const generateNextWeekAssignments = () => {
    setIsGenerating(true);
    const newShifts: any[] = [];

    nextWeekDates.forEach((date, dayIndex) => {
      const dateStr = date.toISOString().split("T")[0];
      const isFirstSunday = dayIndex === 0;
      const isLastSunday = dayIndex === 7;

      demoPositions.forEach((position, positionIndex) => {
        // For each position, create 2 shifts per day (morning and evening)
        const shiftsForDay = [];
        
        if (!isFirstSunday) {
          // Morning shift (default 08:00-12:00)
          shiftsForDay.push({
            timeSlot: "morning",
            startTime: "08:00",
            endTime: "12:00"
          });
        }
        
        if (!isLastSunday) {
          // Evening shift (default 20:00-00:00)
          shiftsForDay.push({
            timeSlot: "evening",
            startTime: "20:00",
            endTime: "00:00"
          });
        }

        shiftsForDay.forEach((shiftInfo) => {
          // Find available workers for this slot
          const availableWorkers = workers.filter((worker) => {
            if (worker.role === "manager") return false; // Don't assign managers to shifts
            const workerAvailability = availability.find(
              (avail) =>
                avail.workerId === worker.id &&
                avail.date === dateStr &&
                avail.timeSlot === shiftInfo.timeSlot
            );
            return !workerAvailability || workerAvailability.isAvailable;
          });

          // Assign worker (simple round-robin for demo)
          const assignedWorker = availableWorkers[positionIndex % availableWorkers.length] || availableWorkers[0];

          if (assignedWorker) {
            newShifts.push({
              id: `${dateStr}-${position}-${shiftInfo.timeSlot}`,
              date: dateStr,
              timeSlot: shiftInfo.timeSlot,
              startTime: shiftInfo.startTime,
              endTime: shiftInfo.endTime,
              station: position,
              workerId: assignedWorker.id,
              workerName: assignedWorker.name,
              status: "assigned",
            });
          }
        });
      });
    });

    setShifts(newShifts);
    setIsGenerating(false);
  };

  const renderCurrentWeekTable = () => (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
        overflowX: "auto",
        "& th:first-of-type, & td:first-of-type": { pr: 0 },
      }}
    >
      <Table
        sx={{
          "& .MuiTableRow-root > *:first-of-type": { pr: 0, pl: 0, textAlign: "right" },
          "& .MuiTableRow-root > *:nth-of-type(2)": { pl: 0 },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>עמדה</TableCell>
            {currentWeekDates.map((date, index) => (
              <TableCell key={date.toISOString()} sx={{ fontWeight: "bold", textAlign: "center" }}>
                {hebrewDays[index]}
                <Typography variant="caption" display="block">
                  {date.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" })}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {demoPositions.map((position) => (
            <TableRow key={position}>
              <TableCell sx={{ fontWeight: "bold" }}>{position}</TableCell>
              {currentWeekDates.map((date) => {
                const dateStr = date.toISOString().split("T")[0];
                const shift = shifts.find((s) => s.date === dateStr && s.station === position);

                return (
                  <TableCell key={dateStr} align="center">
                    {shift ? (
                      <Select
                        value={shift.workerId}
                        onChange={(e) => handleWorkerChange(shift.id, e.target.value as string)}
                        size="small"
                        sx={{ minWidth: 100 }}
                      >
                        {workers.filter(w => w.role === "worker").map((w) => (
                          <MenuItem key={w.id} value={w.id}>
                            {w.name}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <Typography variant="caption" color="textSecondary">
                        לא משובץ
                      </Typography>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderNextWeekTable = () => (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>איולוצים נאספו עד רביעי.</strong> ביום חמישי-שישי יפורסם השיבוץ הבא.
        </Typography>
      </Alert>

      <Button
        variant="contained"
        color="primary"
        onClick={generateNextWeekAssignments}
        disabled={isGenerating}
        startIcon={<AutoFixHigh />}
        sx={{ mb: 2 }}
      >
        {isGenerating ? "יוצר שיבוצים..." : "יצירת שיבוצים אוטומטית"}
      </Button>

      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          overflowX: "auto",
          "& th:first-of-type, & td:first-of-type": { pr: 0 },
        }}
      >
        <Table
          sx={{
            "& .MuiTableRow-root > *:first-of-type": { pr: 0, pl: 0, textAlign: "right" },
            "& .MuiTableRow-root > *:nth-of-type(2)": { pl: 0 },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", pr: 0, pl: 0 }}>עמדה</TableCell>
              {nextWeekDates.map((date, index) => (
                <TableCell key={date.toISOString()} sx={{ fontWeight: "bold", textAlign: "center" }}>
                  {hebrewDays[index]}
                  <Typography variant="caption" display="block">
                    {date.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" })}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {demoPositions.map((position) => (
              <TableRow key={position}>
                <TableCell sx={{ fontWeight: "bold", pr: 0, pl: 0 }}>{position}</TableCell>
                {nextWeekDates.map((date) => {
                  const dateStr = date.toISOString().split("T")[0];
                  const shift = shifts.find((s) => s.date === dateStr && s.station === position);

                  return (
                    <TableCell key={dateStr} align="center">
                      {shift ? (
                        <Select
                          value={shift.workerId}
                          onChange={(e) => handleWorkerChange(shift.id, e.target.value as string)}
                          size="small"
                          sx={{ minWidth: 100 }}
                        >
                          {workers.filter(w => w.role === "worker").map((w) => (
                            <MenuItem key={w.id} value={w.id}>
                              {w.name}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <Typography variant="caption" color="textSecondary">
                          לא משובץ
                        </Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderConstraintsTable = () => {
    const workerConstraints = workers.map((worker) => {
      const workerAvail = availability.filter((avail) => avail.workerId === worker.id);
      return {
        worker,
        constraints: workerAvail.filter((avail) => !avail.isAvailable),
      };
    });

    return (
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          overflowX: "auto",
          "& th:first-of-type, & td:first-of-type": { pr: 0 },
        }}
      >
        <Table
          sx={{
            "& .MuiTableRow-root > *:first-of-type": { pr: 0, pl: 0, textAlign: "right" },
            "& .MuiTableRow-root > *:nth-of-type(2)": { pl: 0 },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", pr: 0, pl: 0 }}>עובד</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>תאריך</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>משמרת</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>הסבר</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workerConstraints.map(({ worker, constraints }) =>
              constraints.length === 0 ? (
                <TableRow key={worker.id}>
                  <TableCell>{worker.name}</TableCell>
                  <TableCell colSpan={3} align="center">
                    <Chip label="אין איולוצים" color="success" size="small" />
                  </TableCell>
                </TableRow>
              ) : (
                constraints.map((constraint) => (
                  <TableRow key={constraint.id}>
                    <TableCell sx={{ pr: 0, pl: 0 }}>{worker.name}</TableCell>
                    <TableCell>{new Date(constraint.date).toLocaleDateString("he-IL")}</TableCell>
                    <TableCell>
                      {constraint.timeSlot === "morning" ? "08:00-12:00" : "20:00-00:00"}
                    </TableCell>
                    <TableCell>{constraint.note || "לא צוין הסבר"}</TableCell>
                  </TableRow>
                ))
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderPreviousAssignments = () => (
    <Alert severity="info">
      <Typography variant="body2">
        כאן יוצגו השיבוצים הקודמים. רק מנהלים יכולים לראות היסטוריה זו.
      </Typography>
    </Alert>
  );

  return (
    <Box dir="rtl" sx={{ maxWidth: "100%" }}>
      <Typography variant="h4" sx={{ color: "red", fontSize: "2rem", mb: 3 }}>
        🚨 ניהול משמרות - TEST! {new Date().toLocaleTimeString()} 🚨
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3, px: 0 }}>
        <Tab icon={<Visibility />} label="שבוע נוכחי" iconPosition="start" />
        <Tab icon={<AutoFixHigh />} label="שיבוץ הבא" iconPosition="start" />
        <Tab icon={<Visibility />} label="איולוצים" iconPosition="start" />
        <Tab icon={<History />} label="היסטוריה" iconPosition="start" />
      </Tabs>

      <Box sx={{ mt: 2, px: 0 }}>
        {tabValue === 0 && renderCurrentWeekTable()}
        {tabValue === 1 && renderNextWeekTable()}
        {tabValue === 2 && renderConstraintsTable()}
        {tabValue === 3 && renderPreviousAssignments()}
      </Box>
    </Box>
  );
}
