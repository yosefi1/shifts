'use client';

import React, { useState, useEffect } from 'react';
import {
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
  Typography,
  Box,
  Button,
  Alert,
} from '@mui/material';

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
  workers: User[];
}

interface DayShifts {
  first: Shift;
  second: Shift;
  [key: string]: Shift;
}

interface ShiftsState {
  [day: string]: DayShifts;
}

// Week hour options - 3 different shift configurations
const WEEK_HOUR_OPTIONS = [
  { 
    id: 'morning', 
    name: 'בוקר וערב', 
    first: { name: 'משמרת ראשונה', hours: '08:00-12:00', start: 8, end: 12 },
    second: { name: 'משמרת שנייה', hours: '20:00-00:00', start: 20, end: 24 }
  },
  { 
    id: 'afternoon', 
    name: 'צהריים ולילה', 
    first: { name: 'משמרת ראשונה', hours: '12:00-16:00', start: 12, end: 16 },
    second: { name: 'משמרת שנייה', hours: '00:00-04:00', start: 0, end: 4 }
  },
  { 
    id: 'evening', 
    name: 'ערב ובוקר מוקדם', 
    first: { name: 'משמרת ראשונה', hours: '16:00-20:00', start: 16, end: 20 },
    second: { name: 'משמרת שנייה', hours: '04:00-08:00', start: 4, end: 8 }
  }
];

const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export default function Shifts() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentWeekType, setCurrentWeekType] = useState('morning');
  const [shifts, setShifts] = useState<ShiftsState>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      initializeShifts();
    }
  }, [users, currentWeekType]);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setMessage('שגיאה בטעינת עובדים');
      }
    } catch (error) {
      setMessage('שגיאה בטעינת עובדים');
    }
  };

  const initializeShifts = () => {
    const selectedWeekType = WEEK_HOUR_OPTIONS.find(opt => opt.id === currentWeekType);
    if (!selectedWeekType) return;

    const newShifts: ShiftsState = {};
    
    DAYS.forEach(day => {
      newShifts[day] = {
        first: {
          assigned: null,
          available: getAvailableWorkers(day, 'first'),
          workers: []
        },
        second: {
          assigned: null,
          available: getAvailableWorkers(day, 'second'),
          workers: []
        }
      };
    });

    setShifts(newShifts);
  };

  const getAvailableWorkers = (day: string, shiftType: string): User[] => {
    // Filter out managers and get workers who can work
    const availableWorkers = users.filter(user => 
      user.role === 'worker'
    );

    // Filter out workers already assigned to this day
    const dayShifts = shifts[day];
    if (dayShifts) {
      return availableWorkers.filter(user => {
        const alreadyAssigned = dayShifts.first.workers.some(w => w.id === user.id) ||
                               dayShifts.second.workers.some(w => w.id === user.id);
        return !alreadyAssigned;
      });
    }

    return availableWorkers;
  };

  const handleShiftAssignment = (day: string, shiftType: string, userId: string | null) => {
    setShifts((prev: ShiftsState) => {
      const newShifts = { ...prev };
      
      if (userId) {
        // Add worker to shift
        const user = users.find(u => u.id === userId);
        if (user) {
          newShifts[day][shiftType].workers.push(user);
          newShifts[day][shiftType].assigned = user.name;
        }
      } else {
        // Remove worker from shift
        newShifts[day][shiftType].workers = [];
        newShifts[day][shiftType].assigned = null;
      }

      // Update available workers for all shifts on this day
      DAYS.forEach(d => {
        if (d === day) {
          newShifts[d].first.available = getAvailableWorkers(d, 'first');
          newShifts[d].second.available = getAvailableWorkers(d, 'second');
        }
      });

      return newShifts;
    });
  };

  const handleAutomaticAssignment = () => {
    // Simple automatic assignment logic
    const availableWorkers = users.filter(user => user.role === 'worker');
    
    setShifts((prev: ShiftsState) => {
      const newShifts = { ...prev };
      
      DAYS.forEach(day => {
        let workerIndex = 0;
        
        ['first', 'second'].forEach(shiftType => {
          if (availableWorkers[workerIndex]) {
            const worker = availableWorkers[workerIndex];
            newShifts[day][shiftType].workers = [worker];
            newShifts[day][shiftType].assigned = worker.name;
            workerIndex++;
          }
        });
      });

      return newShifts;
    });

    setMessage('שיבוץ אוטומטי הושלם');
  };

  const selectedWeekType = WEEK_HOUR_OPTIONS.find(opt => opt.id === currentWeekType);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        ניהול שיבוצים
      </Typography>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Week Hours Selection */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>שעות השבוע</InputLabel>
          <Select
            value={currentWeekType}
            label="שעות השבוע"
            onChange={(e) => setCurrentWeekType(e.target.value)}
          >
            {WEEK_HOUR_OPTIONS.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button 
          variant="contained" 
          onClick={handleAutomaticAssignment}
          sx={{ ml: 2 }}
        >
          שיבוץ אוטומטי
        </Button>
      </Box>

      {/* Shifts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>עמדה</TableCell>
              {DAYS.map((day) => (
                <TableCell key={day} align="center" colSpan={2}>
                  {day}
                  <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                    {day === 'ראשון' ? '31.08' : 
                     day === 'שני' ? '01.09' : 
                     day === 'שלישי' ? '02.09' : 
                     day === 'רביעי' ? '03.09' : 
                     day === 'חמישי' ? '04.09' : 
                     day === 'שישי' ? '05.09' : '06.09'}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              {DAYS.map((day) => (
                <React.Fragment key={day}>
                  <TableCell align="center" sx={{ backgroundColor: '#e3f2fd' }}>
                    {selectedWeekType?.first.hours}
                  </TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#fff3e0' }}>
                    {selectedWeekType?.second.hours}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {['א', 'ב', 'ג', 'ד', 'ה', 'ו'].map((position) => (
              <TableRow key={position}>
                <TableCell>{position}</TableCell>
                {DAYS.map((day) => (
                  <React.Fragment key={day}>
                    {/* First Shift */}
                    <TableCell>
                      {shifts[day]?.first.assigned ? (
                        <Box>
                          <Typography variant="body2">{shifts[day].first.assigned}</Typography>
                          <Button 
                            size="small" 
                            onClick={() => handleShiftAssignment(day, 'first', null)}
                            sx={{ mt: 1 }}
                          >
                            הסר
                          </Button>
                        </Box>
                      ) : (
                        <FormControl fullWidth size="small">
                          <Select
                            value=""
                            displayEmpty
                            onChange={(e) => handleShiftAssignment(day, 'first', e.target.value)}
                          >
                            <MenuItem value="" disabled>
                              בחר עובד
                            </MenuItem>
                            {shifts[day]?.first.available.map((user) => (
                              <MenuItem key={user.id} value={user.id}>
                                {user.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </TableCell>

                    {/* Second Shift */}
                    <TableCell>
                      {shifts[day]?.second.assigned ? (
                        <Box>
                          <Typography variant="body2">{shifts[day].second.assigned}</Typography>
                          <Button 
                            size="small" 
                            onClick={() => handleShiftAssignment(day, 'second', null)}
                            sx={{ mt: 1 }}
                          >
                            הסר
                          </Button>
                        </Box>
                      ) : (
                        <FormControl fullWidth size="small">
                          <Select
                            value=""
                            displayEmpty
                            onChange={(e) => handleShiftAssignment(day, 'second', e.target.value)}
                          >
                            <MenuItem value="" disabled>
                              בחר עובד
                            </MenuItem>
                            {shifts[day]?.second.available.map((user) => (
                              <MenuItem key={user.id} value={user.id}>
                                {user.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}