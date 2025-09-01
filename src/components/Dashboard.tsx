"use client";

import { Box, Typography, Card, CardContent, Button } from "@mui/material";

export default function Dashboard() {
  return (
    <Box sx={{ p: 3 }} dir="rtl">
      <Typography variant="h4" gutterBottom>
        לוח משימות — דשבורד
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">הגשת זמינות</Typography>
            <Button variant="contained" fullWidth disabled>
              כניסה
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6">המשמרות שלי</Typography>
            <Button variant="contained" fullWidth disabled>
              צפייה
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6">סטטיסטיקות</Typography>
            <Button variant="outlined" fullWidth disabled>
              בקרוב
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}


