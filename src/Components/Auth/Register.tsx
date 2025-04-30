import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
} from "@mui/material";
import { register } from "../../stores/features/auththunk";
import { RootState, AppDispatch } from "../../stores/store";
import { setError, setSuccess } from "../../stores/features/authslice";

export const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user");

  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(register({ name, email, password, role }));
  };

  // 🔔 Handle success/error updates from Redux
  useEffect(() => {
    if (success) {
      setSnackbar({ message: success, severity: "success" });
      dispatch(setSuccess(null));
      setTimeout(() => navigate("/login"), 2000);
    } else if (error) {
      setSnackbar({ message: error, severity: "error" });
      dispatch(setError(null));
    }
  }, [success, error, dispatch, navigate]);

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
          Welcome 👋
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
          Please register your account
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
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
          <FormControl fullWidth margin="normal" required sx={{ mb: 3 }}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              size="small"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={!!snackbar}
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
