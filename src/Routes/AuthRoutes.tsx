import React, { useState } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Box, Theme, useMediaQuery } from "@mui/material";

// Auth Components
import { Login } from "../Components/Auth/Login";
import { Register } from "../Components/Auth/Register";
import SetPassword from "../Components/Auth/setpassword";
import { AuthGuard } from "../services/Authgaurd";

// Admin Components
import SideNav from "../Pages/admin/sidenave";
import Header from "../Pages/admin/header";
import Setting from "../Pages/admin/settings";
import Analytics from "../Pages/admin/analytics";
import UserManagement from "../Pages/admin/usermanagement";
import AddUser from "../Pages/admin/Adduser";
import AdminProductList from "../Pages/admin/Productlist";
import AddProduct from "../Pages/admin/Addproduct";

// User Components
import User from "../Pages/User";
import Homes from "../Pages/user/Home";
import About from "../Pages/user/about";
import Product from "../Pages/user/Products";
import Services from "../Pages/user/service";
import Profile from "../Pages/admin/Profile";

export const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/set-password" element={<SetPassword />} />

      {/* Admin Routes (Protected) */}
      <Route path="/admin" element={<AuthGuard role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="analytics" replace />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Setting />} />
          <Route path="profile" element={<Profile/>} />

          <Route path="users" element={<UserManagement />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/edit/:id" element={<AddUser />} />

          <Route path="products" element={<AdminProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<AddProduct />} />
        </Route>
      </Route>

      {/* User Routes (Protected) */}
      <Route path="/user" element={<AuthGuard role="user"><User /></AuthGuard>}>
        <Route index element={<Homes />} />
        <Route path="home" element={<Homes />} />
        <Route path="about" element={<About />} />
        <Route path="product" element={<Product />} />
        <Route path="service" element={<Services />} />
      </Route>
    </Routes>
  );
};

const AdminLayout: React.FC = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  return (
    <Box sx={{  display: "flex",  // ✅ Prevent horizontal scroll
    }}>
      {/* Header */}
      <Header onMenuClick={() => setOpen(true)} />

      {/* Sidebar Navigation */}
      {!isMobile ? (
        <SideNav open={true} onClose={() => {}} variant="permanent" />
      ) : (
        <SideNav open={open} onClose={() => setOpen(false)} variant="temporary" />
      )}

      {/* Main Content with horizontal overflow hidden */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: "55px",
          overflowX: "hidden", // ✅ Prevent scroll
          // minWidth: 0, // ✅ Prevent child content from stretching container
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
