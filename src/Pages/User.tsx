import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";
import { RootState } from "../stores/store";
import { Link, Outlet } from "react-router-dom";

const User: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const navLinks = [
    { label: "Home", path: "/user/home" },
    { label: "About", path: "/user/about" },
    { label: "Products", path: "/user/product" },
    { label: "Services", path: "/user/service" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* App Bar */}
      <AppBar position="fixed">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
          {/* Left: Menu Icon & Title */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ ml: isMobile ? 1 : 2 }}>
              User Panel
            </Typography>
          </Box>

          {/* Center: Nav Links (Hidden in Mobile) */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 3, flexGrow: 1, justifyContent: "center" }}>
              {navLinks.map((link) => (
                <Typography
                  key={link.label}
                  component={Link}
                  to={link.path}
                  sx={{ color: "white", textDecoration: "none", fontSize: "1rem" }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          )}

          {/* Right: User Info */}
          {user && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {user.name}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer for Mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250 }}>
          {navLinks.map((link) => (
            <ListItem key={link.label} component={Link} to={link.path} onClick={toggleDrawer(false)}>
              <ListItemText primary={link.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content Wrapper */}
      <Box
        sx={{
          mt: 10, // Push below AppBar
          // p: 3,
          // flexGrow: 1, // Allow content to take full height
          // width: "100%",
          // display: "flex",
          // justifyContent: "flex-start", // Left-align content
          // alignItems:'flex-start'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default User;
