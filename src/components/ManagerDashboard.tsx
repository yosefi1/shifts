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
} from "@mui/material";
import { AutoFixHigh, Visibility, History } from "@mui/icons-material";
import { useAuthStore } from "@/stores/authStore";

export default function ManagerDashboard() {
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shifts, setShifts] = useState<any[]>([]);

  const hebrewDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת", "ראשון"];

  // Demo workers
  const workers = [
    { id: "2", name: "עובד 2" },
    { id: "3", name: "עובד 3" },
    { id: "1", name: "דני כהן" },
    { id: "4", name: "שרה לוי" },
  ];

  // Demo positions (based on your original)
  const demoPositions = [
    "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת",
    "20", "516", "בישרון 11", "בישרון 17", "39 א", "39 ב", "סיור 10", "סיור 10ב"
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

  const generateNextWeekAssignments = () => {
    setIsGenerating(true);
    const newShifts: any[] = [];

    nextWeekDates.forEach((date, dayIndex) => {
      const dateStr = date.toISOString().split("T")[0];
      const isFirstSunday = dayIndex === 0;
      const isLastSunday = dayIndex === 7;

      demoPositions.slice(0, 15).forEach((position, positionIndex) => {
        // Determine available time slots for this day
        const availableSlots = [];
        if (!isFirstSunday) availableSlots.push("morning");
        if (!isLastSunday) availableSlots.push("evening");

        availableSlots.forEach((slot) => {
          // Find available workers for this slot
          const availableWorkers = workers.filter((worker) => {
            const workerAvailability = availability.find(
              (avail) =>
                avail.workerId === worker.id &&
                avail.date === dateStr &&
                avail.timeSlot === slot
            );
            return !workerAvailability || workerAvailability.isAvailable;
          });

          // Assign worker (simple round-robin for demo)
          const assignedWorker = availableWorkers[positionIndex % availableWorkers.length] || availableWorkers[0];

          if (assignedWorker) {
            newShifts.push({
              id: `${dateStr}-${position}-${slot}`,
              date: dateStr,
              startTime: slot === "morning" ? "08:00" : "20:00",
              endTime: slot === "morning" ? "12:00" : "00:00",
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
          {demoPositions.slice(0, 10).map((position) => (
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
                        {workers.map((w) => (
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
            {demoPositions.slice(0, 10).map((position) => (
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
                          {workers.map((w) => (
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
