import React, { useState, lazy, Suspense } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import {
  Box,
  Theme,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { AuthGuard } from "../services/Authgaurd";



// Lazy-loaded components
const Login = lazy(() =>
  import("../Components/Auth/Login").then((module) => ({
    default: module.Login,
  }))
);
const Register = lazy(() =>
  import("../Components/Auth/Register").then((module) => ({
    default: module.Register,
  }))
);
const SetPassword = lazy(() => import("../Components/Auth/setpassword"));
const SideNav = lazy(() => import("../Pages/admin/sidenave"));
const Header = lazy(() => import("../Pages/admin/header"));
const Setting = lazy(() => import("../Pages/admin/settings"));
const Analytics = lazy(() => import("../Pages/admin/analytics"));
const UserManagement = lazy(() => import("../Pages/admin/usermanagement"));
const AddUser = lazy(() => import("../Pages/admin/Adduser"));
const AdminProductList = lazy(() => import("../Pages/admin/Productlist"));
const AddProduct = lazy(() => import("../Pages/admin/Addproduct"));
const User = lazy(() => import("../Pages/User"));
const Homes = lazy(() => import("../Pages/user/Home"));
const About = lazy(() => import("../Pages/user/about"));
const Product = lazy(() => import("../Pages/user/Products"));
const Services = lazy(() => import("../Pages/user/service"));
const Profile = lazy(() => import("../Pages/admin/Profile"));

interface AuthProps {
  setSnackBar: React.Dispatch<
    React.SetStateAction<{
      message: string;
      severity: "success" | "error";
    } | null>
  >;
}

const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

export const AuthRoutes: React.FC<AuthProps> = ({ setSnackBar }) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login setSnackBar={setSnackBar} />} />
        <Route path="/login" element={<Login setSnackBar={setSnackBar} />} />
        <Route
          path="/register"
          element={<Register setSnackBar={setSnackBar} />}
        />
        <Route
          path="/set-password"
          element={<SetPassword setSnackBar={setSnackBar} />}
        />

        {/* Admin Routes (Protected) */}
        <Route path="/admin" element={<AuthGuard role="admin" />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="analytics" replace />} />
            <Route path="analytics" element={<Analytics />} />
            <Route
              path="settings"
              element={<Setting setSnackBar={setSnackBar} />}
            />
            <Route
              path="profile"
              element={<Profile setSnackBar={setSnackBar} />}
            />

            <Route
              path="users"
              element={<UserManagement setSnackBar={setSnackBar} />}
            />
            <Route
              path="users/add"
              element={<AddUser setSnackBar={setSnackBar} />}
            />
            <Route
              path="users/edit/:id"
              element={<AddUser setSnackBar={setSnackBar} />}
            />

            <Route
              path="products"
              element={<AdminProductList setSnackBar={setSnackBar} />}
            />
            <Route
              path="products/add"
              element={<AddProduct setSnackBar={setSnackBar} />}
            />
            <Route
              path="products/edit/:id"
              element={<AddProduct setSnackBar={setSnackBar} />}
            />
          </Route>
        </Route>

        {/* User Routes (Protected) */}
        <Route
          path="/user"
          element={
            <AuthGuard role="user">
              <User />
            </AuthGuard>
          }
        >
          <Route index element={<Homes />} />
          <Route path="home" element={<Homes />} />
          <Route path="about" element={<About />} />
          <Route path="product" element={<Product />} />
          <Route path="service" element={<Services />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

 const AdminLayout: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Suspense fallback={null}>
        {/* Header */}
        <Header onMenuClick={() => setOpen(true)} />

        {/* Sidebar Navigation */}
        {!isMobile ? (
          <SideNav open={true} onClose={() => {}} variant="permanent" />
        ) : (
          <SideNav
            open={open}
            onClose={() => setOpen(false)}
            variant="temporary"
          />
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginTop: "55px",
            overflowX: "hidden",
            width: "calc(100% - 240px)", // Account for sidebar width
            backgroundColor: "#393E46",
          }}
        >
          <Suspense fallback={<CircularProgress sx={{ mt: 4 }} />}>
            <Outlet />
          </Suspense>
        </Box>
      </Suspense>
    </Box>
  );
};

export default AuthRoutes;
export { AdminLayout };