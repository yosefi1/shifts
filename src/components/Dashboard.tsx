"use client";

import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { People } from "@mui/icons-material";
import { useAuthStore } from "@/stores/authStore";

type Props = { onNavigate?: (view: string) => void };

export default function Dashboard({ onNavigate }: Props) {
  const { user } = useAuthStore();

  if (user?.role === 'manager') {
    return (
      <Box dir="rtl" sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          ברוך הבא, {user?.name}
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2, mb: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">ניהול שיבוצים</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                צפייה בשיבוצים נוכחיים, יצירת שיבוצים חדשים וניהול איולוצי עובדים
              </Typography>
              <Button variant="contained" fullWidth onClick={() => onNavigate?.('shifts')}>
                עבור לניהול שיבוצים
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <People />
                ניהול עובדים
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                הוספה, עריכה ומחיקה של עובדים במערכת
              </Typography>
              <Button variant="contained" fullWidth onClick={() => onNavigate?.('workers')}>
                עבור לניהול עובדים
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6">סטטיסטיקות</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                סקירה כללית של השיבוצים והעובדים במערכת
              </Typography>
              <Button variant="outlined" fullWidth disabled>
                בקרוב
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }

  return (
    <Box dir="rtl" sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        ברוך הבא, {user?.name}
      </Typography>
      <Typography variant="h6" sx={{ mb: 3, color: "text.secondary" }}>
        דף הבית שלך - בקרוב יהיה זמין
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">המשמרות שלי</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              צפייה במשמרות הקרובות והנוכחיות
            </Typography>
            <Button variant="contained" fullWidth onClick={() => onNavigate?.('my-shifts')}>
              עבור למשמרות שלי
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6">העדפות אישיות</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              הגדרת זמינות והעדפות עבודה
            </Typography>
            <Button variant="outlined" fullWidth disabled>
              בקרוב
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}


