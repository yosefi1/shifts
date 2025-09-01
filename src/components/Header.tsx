"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

type HeaderProps = {
  title?: string;
};

export default function Header({ title = "Shifts Management" }: HeaderProps) {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Box />
      </Toolbar>
    </AppBar>
  );
}


