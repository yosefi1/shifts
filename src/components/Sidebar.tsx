"use client";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

const items = [
  { key: "dashboard", label: "דשבורד" },
  { key: "workers", label: "עובדים" },
  { key: "shifts", label: "משמרות" },
  { key: "constraints", label: "מגבלות" },
  { key: "preferences", label: "העדפות" },
];

type SidebarProps = {
  currentView: string;
  onViewChange: (key: string) => void;
};

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <Drawer variant="permanent" anchor="right" sx={{ width: 220, ["& .MuiDrawer-paper"]: { width: 220, boxSizing: "border-box" } }}>
      <List>
        {items.map((it) => (
          <ListItem key={it.key} disablePadding>
            <ListItemButton selected={currentView === it.key} onClick={() => onViewChange(it.key)}>
              <ListItemText primary={it.label} sx={{ textAlign: "right" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}


