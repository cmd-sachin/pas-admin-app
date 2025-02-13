"use client";

import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import { theme } from "../styles/theme";

const drawerWidth = 240;

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  // Toggle drawer open/close
  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* Top AppBar */}
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Temporary Sidebar Drawer */}
        <Drawer
          variant="temporary"
          anchor="left"
          open={open}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {/* Spacer to push drawer content below the AppBar */}
          <Toolbar />
          <List>
            {["Dashboard", "Candidates", "Leaderboard"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={toggleDrawer}>
                  <ListItemIcon>
                    {index === 0 ? (
                      <DashboardIcon />
                    ) : index === 1 ? (
                      <PeopleIcon />
                    ) : (
                      <BarChartIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {/* Spacer for the fixed AppBar */}
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
