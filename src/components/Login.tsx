"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const user = await login(userId);
      if (!user) {
        setError("מזהה משתמש לא תקין");
      }
    } catch (err) {
      setError("שגיאה בהתחברות");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = () => {
    setUserId("0");
    login("0");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        sx={{
          p: 4,
          minWidth: 300,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          כניסה למערכת
        </Typography>
        
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="מזהה משתמש"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />
          
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            {isLoading ? "מתחבר..." : "כניסה"}
          </Button>
        </form>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={handleQuickLogin}
          disabled={isLoading}
        >
          כניסה מהירה (מנהל)
        </Button>
      </Paper>
    </Box>
  );
}
