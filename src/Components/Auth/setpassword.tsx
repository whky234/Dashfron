/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import { clearMessages } from "../../stores/features/authslice";
import { setNewPassword } from "../../stores/features/auththunk";
import Handlemessages from "../../hooks/Handlemessage";

interface SetPasswordProps {
  setSnackBar: React.Dispatch<
    React.SetStateAction<{
      message: string;
      severity: "success" | "error";
    } | null>
  >;
}

const SetPassword: React.FC<SetPasswordProps> = ({ setSnackBar }) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { message, error, loading } = useSelector(
    (state: RootState) => state.auth
  );

  // Hook to handle showing message/error via Snackbar
  Handlemessages({
    message,
    error,
    clearMessageAction: clearMessages,
    setSnackBar,
    dispatch,
  });

  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setSnackBar({
        message: "Token is missing or invalid.",
        severity: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      setSnackBar({
        message: "Passwords do not match.",
        severity: "error",
      });
      return;
    }

    try {
      await dispatch(setNewPassword({ token, password }));

      navigate("/login");
    } catch (err: any) {
    }
  };

  return (

    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Set Your Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
  inputProps={{ 'data-testid': 'new-password' }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
  inputProps={{ 'data-testid': 'confirm-password' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? "Setting..." : "Set Password"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SetPassword;
