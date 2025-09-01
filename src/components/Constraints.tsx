"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Paper,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useAuthStore } from "@/stores/authStore";

export default function Constraints() {
  const { user } = useAuthStore();
  const [constraints, setConstraints] = useState<any[]>([]);
  const [newConstraint, setNewConstraint] = useState({
    date: "",
    timeSlot: "first",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Generate next 7 days
  const today = new Date();
  const nextWeekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  // Mock constraints data
  useEffect(() => {
    setConstraints([
      {
        id: "1",
        workerId: user?.id,
        date: "2024-01-15",
        timeSlot: "first",
        reason: "פגישה רפואית",
      },
      {
        id: "2",
        workerId: user?.id,
        date: "2024-01-16",
        timeSlot: "second",
        reason: "חופשה משפחתית",
      },
    ]);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const constraint = {
        id: `${user.id}-${newConstraint.date}-${newConstraint.timeSlot}`,
        workerId: user.id,
        date: newConstraint.date,
        timeSlot: newConstraint.timeSlot,
        reason: newConstraint.reason,
        isBlocked: true,
        created_at: new Date().toISOString(),
      };

      setConstraints([...constraints, constraint]);
      setNewConstraint({ date: "", timeSlot: "first", reason: "" });
      setSuccess("האילוץ נוסף בהצלחה!");
    } catch (error) {
      console.error("Add constraint error:", error);
      setError("שגיאה בהוספת האילוץ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (constraintId: string) => {
    try {
      setConstraints(constraints.filter((c) => c.id !== constraintId));
      setSuccess("האילוץ נמחק בהצלחה!");
    } catch (error) {
      setError("שגיאה במחיקת האילוץ");
      console.error("Delete constraint error:", error);
    }
  };

  const getTimeSlotText = (timeSlot: string) => {
    switch (timeSlot) {
      case "first":
        return "20:00-00:00";
      case "second":
        return "08:00-12:00";
      default:
        return timeSlot;
    }
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    return days[date.getDay()];
  };

  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">יש להתחבר כדי לראות איולוצים</Typography>
      </Box>
    );
  }

  return (
    <Box dir="rtl" sx={{ maxWidth: "800px", mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ color: "blue", mb: 3 }}>
        ניהול איולוצים
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          כאן תוכל להוסיף איולוצים (מתי לא תוכל לעבוד) למנהלים
        </Typography>
      </Alert>

      {/* Add new constraint form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          הוסף איולוץ חדש
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl fullWidth>
            <InputLabel>תאריך</InputLabel>
            <Select
              value={newConstraint.date}
              onChange={(e) =>
                setNewConstraint({ ...newConstraint, date: e.target.value })
              }
              label="תאריך"
              required
            >
              {nextWeekDates.map((date) => {
                const dateStr = date.toISOString().split("T")[0];
                return (
                  <MenuItem key={dateStr} value={dateStr}>
                    {getDayName(dateStr)} - {date.toLocaleDateString("he-IL")}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>משמרת</InputLabel>
            <Select
              value={newConstraint.timeSlot}
              onChange={(e) =>
                setNewConstraint({ ...newConstraint, timeSlot: e.target.value })
              }
              label="משמרת"
              required
            >
              <MenuItem value="first">20:00-00:00 (ערב)</MenuItem>
              <MenuItem value="second">08:00-12:00 (בוקר)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="סיבה"
            value={newConstraint.reason}
            onChange={(e) =>
              setNewConstraint({ ...newConstraint, reason: e.target.value })
            }
            required
            multiline
            rows={3}
            placeholder="למה לא תוכל לעבוד? (חופשה, פגישה רפואית, וכו')"
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={<Add />}
            sx={{ alignSelf: "flex-start" }}
          >
            {isSubmitting ? "מוסיף..." : "הוסף איולוץ"}
          </Button>
        </Box>
      </Paper>

      {/* Show error/success messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {/* Display existing constraints */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        האיולוצים שלך
      </Typography>

      {constraints.length === 0 ? (
        <Alert severity="info">
          אין לך איולוצים עדיין. הוסף איולוץ חדש למעלה.
        </Alert>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {constraints.map((constraint) => (
            <Card key={constraint.id}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="h6">
                      {getDayName(constraint.date)} -{" "}
                      {new Date(constraint.date).toLocaleDateString("he-IL")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      משמרת: {getTimeSlotText(constraint.timeSlot)}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {constraint.reason}
                    </Typography>
                  </Box>

                  <IconButton
                    color="error"
                    onClick={() => handleDelete(constraint.id)}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}