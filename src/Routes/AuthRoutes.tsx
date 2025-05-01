import React, { useState } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Box, Theme, useMediaQuery, useTheme } from "@mui/material";

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

interface Authtprops{
  setSnackBar:React.Dispatch<React.SetStateAction<{message:string,severity:'success'|'error'}|null>>;
}

export const AuthRoutes: React.FC<Authtprops> = ({setSnackBar }) => {
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login setSnackBar={setSnackBar} />} />
      <Route path="/login" element={<Login setSnackBar={setSnackBar} />} />
      <Route path="/register" element={<Register setSnackBar={setSnackBar} />} />
      <Route path="/set-password" element={<SetPassword setSnackBar={setSnackBar} />} />

      {/* Admin Routes (Protected) */}
      <Route path="/admin" element={<AuthGuard role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="analytics" replace />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Setting />} />
          <Route path="profile" element={<Profile setSnackBar={setSnackBar}/>} />

          <Route path="users" element={<UserManagement setSnackBar={setSnackBar} />} />
          <Route path="users/add" element={<AddUser  setSnackBar={setSnackBar}/>} />
          <Route path="users/edit/:id" element={<AddUser setSnackBar={setSnackBar} />} />

          <Route path="products" element={<AdminProductList setSnackBar={setSnackBar}/>} />
          <Route path="products/add" element={<AddProduct  setSnackBar={setSnackBar}/>} />
          <Route path="products/edit/:id" element={<AddProduct setSnackBar={setSnackBar} />} />
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
  const theme=useTheme()

  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  return (
    <Box sx={{  display: "flex", backgroundColor:theme.palette.background.default
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
