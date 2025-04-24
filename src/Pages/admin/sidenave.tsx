import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useMediaQuery,
  Theme,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
} from "@mui/material";

import {
  People as PeopleIcon,
  BarChart as AnalyticsIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  ExpandLess,
  ExpandMore,
  PersonAdd as AddUserIcon,
  Group as AllUsersIcon,
  Person,
} from "@mui/icons-material";

interface SideNavProps {
  open: boolean;
  onClose: () => void;
  variant: "permanent" | "temporary";
}

const SideNav: React.FC<SideNavProps> = ({ open, onClose, variant }) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
  };

  const isActive = (path: string) => location.pathname === path;

  const drawerWidth = 250;
  const sidebarBg = "#1E293B";
  const activeBg = "#334155";

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant={variant}
      sx={{
        width: variant === "permanent" ? drawerWidth : "auto",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          marginTop: isMobile ? 0 : "64px",
          height: "100%",
          backgroundColor: sidebarBg,
          color: "#fff",
        },
      }}
    >
      <Box>
        {variant === "temporary" && (
          <IconButton
            onClick={onClose}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 1,
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        <List>
          {/* User Management with dropdown */}
          <ListItem
            component={Link}
            to="/admin/analytics"
            onClick={onClose}
            sx={{
              color: "white",
              backgroundColor: isActive("/admin/analytics")
                ? activeBg
                : "inherit",
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <AnalyticsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{ fontSize: "0.875rem" }} // or '0.75rem' for smaller
            />
          </ListItem>
          <ListItem
            component="div"
            
            onClick={toggleUserMenu}
            sx={{
              color: "white",
              backgroundColor: location.pathname.startsWith("/admin/users")
                ? activeBg
                : "inherit",
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText
              primary="User Management"
              primaryTypographyProps={{ fontSize: "0.875rem" }} // or '0.75rem' for smaller
            />
            {userMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={userMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                component={Link}
                to="/admin/users"
                onClick={onClose}
                sx={{
                  pl: 4,
                  color: "white",
                  backgroundColor: isActive("/admin/users")
                    ? activeBg
                    : "inherit",
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>
                  <AllUsersIcon />
                </ListItemIcon>
                <ListItemText
                  primary="All Users"
                  primaryTypographyProps={{ fontSize: "0.875rem" }} // or '0.75rem' for smaller
                />
              </ListItem>
              <ListItem
                component={Link}
                to="/admin/users/add"
                onClick={onClose}
                sx={{
                  pl: 4,
                  color: "white",
                  backgroundColor: isActive("/admin/users/add")
                    ? activeBg
                    : "inherit",
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>
                  <AddUserIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Add User"
                  primaryTypographyProps={{ fontSize: "0.875rem" }} // or '0.75rem' for smaller
                />
              </ListItem>
            </List>
          </Collapse>

          {/* Other Menu Items */}
          <ListItem
            component={Link}
            to="/admin/products"
            onClick={onClose}
            sx={{
              color: "white",
              backgroundColor: isActive("/admin/products")
                ? activeBg
                : "inherit",
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <AnalyticsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Product"
              primaryTypographyProps={{ fontSize: "0.875rem" }} // or '0.75rem' for smaller
            />
          </ListItem>

          <ListItem
            component={Link}
            to="/admin/settings"
            onClick={onClose}
            sx={{
              color: "white",
              backgroundColor: isActive("/admin/settings")
                ? activeBg
                : "inherit",
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{ fontSize: "0.875rem" }} // or '0.75rem' for smaller
            />
          </ListItem>

          <ListItem
            component={Link}
            to="/admin/profile"
            onClick={onClose}
            sx={{
              color: "white",
              backgroundColor: isActive("/admin/profile")
                ? activeBg
                : "inherit",
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <Person />
            </ListItemIcon>
            <ListItemText
              primary="Profile"
              primaryTypographyProps={{ fontSize: "0.875rem" }} // or '0.75rem' for smaller
            />
          </ListItem>
        </List>
        <Divider sx={{ backgroundColor: "#fff", opacity: 0.2 }} />
      </Box>
    </Drawer>
  );
};

export default SideNav;
