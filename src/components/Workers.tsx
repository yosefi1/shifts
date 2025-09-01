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

  // Real workers from the old project - updated list
  useEffect(() => {
    setUsers([
      { id: "0", name: "מנהל", role: "manager", gender: "male", keepShabbat: true },
      { id: "8863762", name: "בן קורל", role: "worker", gender: "male", keepShabbat: true },
      { id: "8279948", name: "טל אדרי", role: "worker", gender: "male", keepShabbat: true },
      { id: "9033163", name: "ליאב אביסידריס", role: "worker", gender: "male", keepShabbat: true },
      { id: "8880935", name: "ליאל שקד", role: "worker", gender: "male", keepShabbat: true },
      { id: "8679277", name: "מאור יצחק קפון", role: "worker", gender: "male", keepShabbat: true },
      { id: "9192400", name: "מור לחמני", role: "worker", gender: "male", keepShabbat: true },
      { id: "9181564", name: "נויה חזן", role: "worker", gender: "female", keepShabbat: false },
      { id: "8379870", name: "סילנאט טזרה", role: "worker", gender: "female", keepShabbat: false },
      { id: "8783268", name: "סתיו גינה", role: "worker", gender: "male", keepShabbat: true },
      { id: "9113482", name: "עהד הזימה", role: "worker", gender: "male", keepShabbat: true },
      { id: "9113593", name: "עומרי סעד", role: "worker", gender: "male", keepShabbat: true },
      { id: "8801813", name: "קטרין בטקיס", role: "worker", gender: "female", keepShabbat: false },
      { id: "8573304", name: "רונן רזיאב", role: "worker", gender: "male", keepShabbat: true },
      { id: "5827572", name: "רפאל ניסן", role: "worker", gender: "male", keepShabbat: true },
      { id: "9147342", name: "רפאלה רזניקוב", role: "worker", gender: "female", keepShabbat: false },
      { id: "8798653", name: "שירן מוסרי", role: "worker", gender: "male", keepShabbat: true },
      { id: "9067567", name: "שרון סולימני", role: "worker", gender: "male", keepShabbat: true },
      { id: "8083576", name: "יקיר אלדד", role: "worker", gender: "male", keepShabbat: true }
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
      
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>שים לב:</strong> הוספת עובדים חדשים נשמרת רק במחשב המקומי. 
          כדי לשמור עובדים חדשים במאגר הנתונים, יש צורך בחיבור למאגר נתונים חיצוני.
        </Typography>
      </Alert>

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
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 3fr 2fr 2fr auto" }, gap: 2, alignItems: "end" }}>
              <TextField
                fullWidth
                label="מספר אישי (קוד כניסה לאתר)"
                value={newWorker.id}
                onChange={(e) =>
                  setNewWorker({ ...newWorker, id: e.target.value })
                }
                helperText="המספר האישי משמש כקוד כניסה לאתר"
              />
              <TextField
                fullWidth
                label="שם"
                value={newWorker.name}
                onChange={(e) =>
                  setNewWorker({ ...newWorker, name: e.target.value })
                }
              />

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
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Workers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
              <TableCell align="right">מספר אישי (קוד כניסה)</TableCell>
              <TableCell align="right">שם</TableCell>
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