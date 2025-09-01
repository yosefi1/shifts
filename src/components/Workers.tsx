"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Alert,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

export default function Workers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isAddingWorker, setIsAddingWorker] = useState(false);
  const [editingWorker, setEditingWorker] = useState<string | null>(null);
  const [newWorker, setNewWorker] = useState({
    id: "",
    name: "",
    role: "worker" as "manager" | "worker",
    gender: "male" as "male" | "female",
    keepShabbat: true,
  });
  const [message, setMessage] = useState("");

  // Mock data for now
  useEffect(() => {
    setUsers([
      {
        id: "0",
        name: "Test Manager",
        role: "manager",
        gender: "male",
        keepShabbat: true,
      },
      {
        id: "1",
        name: "דני כהן",
        role: "worker",
        gender: "male",
        keepShabbat: true,
      },
      {
        id: "2",
        name: "שרה לוי",
        role: "worker",
        gender: "female",
        keepShabbat: false,
      },
    ]);
  }, []);

  const handleAddWorker = async () => {
    if (!newWorker.id || !newWorker.name) {
      setMessage("נא למלא את כל השדות");
      return;
    }

    try {
      const newUser = { ...newWorker };
      setUsers((prev) => [...prev, newUser]);
      setMessage("עובד נוסף בהצלחה!");
      setNewWorker({
        id: "",
        name: "",
        role: "worker",
        gender: "male",
        keepShabbat: true,
      });
      setIsAddingWorker(false);
    } catch (error) {
      console.error("Error adding worker:", error);
      setMessage("שגיאה בהוספת עובד");
    }
  };

  const handleUpdateWorker = async (userId: string, updates: any) => {
    try {
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, ...updates } : user))
      );
      setMessage("עובד עודכן בהצלחה!");
      setEditingWorker(null);
    } catch (error) {
      console.error("Error updating worker:", error);
      setMessage("שגיאה בעדכון עובד");
    }
  };

  const handleRemoveWorker = async (userId: string) => {
    if (userId === "0") {
      setMessage("לא ניתן למחוק את המנהל");
      return;
    }

    if (window.confirm("האם אתה בטוח שברצונך למחוק עובד זה?")) {
      try {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        setMessage("עובד הוסר בהצלחה!");
      } catch (error) {
        console.error("Error removing worker:", error);
        setMessage("שגיאה בהסרת עובד");
      }
    }
  };

  const startEditing = (user: any) => {
    setEditingWorker(user.id);
    setNewWorker({
      id: user.id,
      name: user.name,
      role: user.role,
      gender: user.gender || "male",
      keepShabbat: user.keepShabbat !== false,
    });
  };

  const cancelEditing = () => {
    setEditingWorker(null);
    setNewWorker({
      id: "",
      name: "",
      role: "worker",
      gender: "male",
      keepShabbat: true,
    });
  };

  const saveEdit = () => {
    if (editingWorker) {
      handleUpdateWorker(editingWorker, newWorker);
    }
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
        ניהול עובדים
      </Typography>

      {/* Message */}
      {message && (
        <Alert
          severity={message.includes("שגיאה") ? "error" : "success"}
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}

      {/* Add Worker Button */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => setIsAddingWorker(true)}
        >
          הוסף עובד חדש
        </Button>
      </Box>

      {/* Add Worker Form */}
      {isAddingWorker && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              הוסף עובד חדש
            </Typography>
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="מספר אישי"
                  value={newWorker.id}
                  onChange={(e) =>
                    setNewWorker({ ...newWorker, id: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="שם"
                  value={newWorker.name}
                  onChange={(e) =>
                    setNewWorker({ ...newWorker, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>תפקיד</InputLabel>
                  <Select
                    value={newWorker.role}
                    onChange={(e) =>
                      setNewWorker({
                        ...newWorker,
                        role: e.target.value as "manager" | "worker",
                      })
                    }
                    label="תפקיד"
                  >
                    <MenuItem value="worker">עובד</MenuItem>
                    <MenuItem value="manager">מנהל</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>מגדר</InputLabel>
                  <Select
                    value={newWorker.gender}
                    onChange={(e) =>
                      setNewWorker({
                        ...newWorker,
                        gender: e.target.value as "male" | "female",
                      })
                    }
                    label="מגדר"
                  >
                    <MenuItem value="male">זכר</MenuItem>
                    <MenuItem value="female">נקבה</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newWorker.keepShabbat}
                      onChange={(e) =>
                        setNewWorker({
                          ...newWorker,
                          keepShabbat: e.target.checked,
                        })
                      }
                    />
                  }
                  label="שומר שבת"
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button variant="contained" color="success" onClick={handleAddWorker}>
                    הוסף
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setIsAddingWorker(false)}
                  >
                    ביטול
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Workers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
              <TableCell align="right">מספר אישי</TableCell>
              <TableCell align="right">שם</TableCell>
              <TableCell align="center">תפקיד</TableCell>
              <TableCell align="center">מגדר</TableCell>
              <TableCell align="center">שומר שבת</TableCell>
              <TableCell align="center">פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell align="right">
                  {editingWorker === user.id ? (
                    <TextField
                      size="small"
                      value={newWorker.id}
                      onChange={(e) =>
                        setNewWorker({ ...newWorker, id: e.target.value })
                      }
                    />
                  ) : (
                    user.id
                  )}
                </TableCell>
                <TableCell align="right">
                  {editingWorker === user.id ? (
                    <TextField
                      size="small"
                      value={newWorker.name}
                      onChange={(e) =>
                        setNewWorker({ ...newWorker, name: e.target.value })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </TableCell>
                <TableCell align="center">
                  {editingWorker === user.id ? (
                    <Select
                      size="small"
                      value={newWorker.role}
                      onChange={(e) =>
                        setNewWorker({
                          ...newWorker,
                          role: e.target.value as "manager" | "worker",
                        })
                      }
                    >
                      <MenuItem value="worker">עובד</MenuItem>
                      <MenuItem value="manager">מנהל</MenuItem>
                    </Select>
                  ) : (
                    user.role === "manager" ? "מנהל" : "עובד"
                  )}
                </TableCell>
                <TableCell align="center">
                  {editingWorker === user.id ? (
                    <Select
                      size="small"
                      value={newWorker.gender}
                      onChange={(e) =>
                        setNewWorker({
                          ...newWorker,
                          gender: e.target.value as "male" | "female",
                        })
                      }
                    >
                      <MenuItem value="male">זכר</MenuItem>
                      <MenuItem value="female">נקבה</MenuItem>
                    </Select>
                  ) : (
                    user.gender === "male"
                      ? "זכר"
                      : user.gender === "female"
                      ? "נקבה"
                      : "-"
                  )}
                </TableCell>
                <TableCell align="center">
                  {editingWorker === user.id ? (
                    <Checkbox
                      checked={newWorker.keepShabbat}
                      onChange={(e) =>
                        setNewWorker({
                          ...newWorker,
                          keepShabbat: e.target.checked,
                        })
                      }
                    />
                  ) : (
                    user.keepShabbat ? "✓" : "✗"
                  )}
                </TableCell>
                <TableCell align="center">
                  {editingWorker === user.id ? (
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                      <Button size="small" variant="contained" color="success" onClick={saveEdit}>
                        שמור
                      </Button>
                      <Button size="small" variant="outlined" onClick={cancelEditing}>
                        ביטול
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        onClick={() => startEditing(user)}
                      >
                        ערוך
                      </Button>
                      {user.id !== "0" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleRemoveWorker(user.id)}
                        >
                          מחק
                        </Button>
                      )}
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}