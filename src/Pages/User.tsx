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
  Divider,
  useTheme,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";
import { RootState } from "../stores/store";
import { Link, Outlet } from "react-router-dom";
import { useThemeContext } from "../Context/usecontext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { dark } from "@mui/material/styles/createPalette";

const User: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const themes = useTheme();
  const isMobile = useMediaQuery(themes.breakpoints.down("md"));

  const { theme, toggletheme } = useThemeContext();

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: theme === "dark" ? "black" : "#fff",
      }}
    >
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{ backgroundColor: theme === "dark" ? "black" : "#1a237e" }}
      >
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
        >
          {/* Left: Menu Icon & Title */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              sx={{ ml: isMobile ? 1 : 2, fontWeight: "bold" }}
            >
              User Panel
            </Typography>
          </Box>

          {/* Center: Nav Links (Hidden in Mobile) */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexGrow: 1,
                justifyContent: "center",
              }}
            >
              {navLinks.map((link) => (
                <Typography
                  key={link.label}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          )}

          {/* Right: User Info */}
          {user && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={toggletheme}
                startIcon={
                  theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />
                }
              ></Button>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {user.name}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer for Mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            backgroundColor: theme === "dark" ? "black" : "#e8eaf6",
            height: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              p: 2,
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: theme === "dark" ? "black" : "#1a237e",
              color: "white",
            }}
          >
            Menu
          </Typography>
          <Divider />
          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.label}
                component={Link}
                to={link.path}
                onClick={toggleDrawer(false)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#c5cae9",
                  },
                }}
              >
                <ListItemText
                  sx={{
                    color: theme === "dark" ? "white" : "#1a237e",
                  }}
                  primary={link.label}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content Wrapper */}
      <Box
        sx={{
          mt: 5, // Push below AppBar
          flexGrow: 1, // Allow content to take full height
          // p: 3,
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: theme === "dark" ? "black" : "#1a237e",
          color: "white",
          textAlign: "center",
          py: 2,
          mt: "auto",
        }}
      >
        <Typography variant="body2">
          &copy; 2025 User Panel. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default User;
