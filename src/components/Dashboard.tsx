"use client";

import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function Dashboard() {
  return (
    <Box sx={{ p: 3 }} dir="rtl">
      <Typography variant="h4" gutterBottom>
        לוח משימות — דשבורד
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">הגשת זמינות</Typography>
              <Button variant="contained" fullWidth disabled>
                כניסה
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">המשמרות שלי</Typography>
              <Button variant="contained" fullWidth disabled>
                צפייה
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">סטטיסטיקות</Typography>
              <Button variant="outlined" fullWidth disabled>
                בקרוב
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}


