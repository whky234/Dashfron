/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Paper,
  Snackbar,
} from "@mui/material";
import { login } from "../../stores/features/auththunk";
import { RootState, AppDispatch } from "../../stores/store";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      setSnackbar({ message: "Login successful!", severity: "success" });

      if (result.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err: any) {
      setSnackbar({
        message: err?.message || "Login failed!",
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={2}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          backgroundColor: "rgba(255,255,255,0.95)",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Welcome Back 👋
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
          Please login to your account
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            size="small"
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            size="small"
            required
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={!!snackbar?.message}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar(null)}
          severity={snackbar?.severity}
          sx={{ width: "100%" }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
