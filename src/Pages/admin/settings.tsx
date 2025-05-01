import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import { newpass } from "../../stores/features/auththunk";
import PaperWrapper from "./paper";
import Whitetextfield from "./whiteTextfield";

const Setting: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setSuccessMessage("");
      setOpenSnackbar(true);
      return;
    }

    try {
      await dispatch(
        newpass({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        })
      ).unwrap();
      setSuccessMessage("Password updated successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setSuccessMessage("");
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <PaperWrapper  sx={{ maxWidth: 400, mx: "auto", p: 9 }}>
      <Typography variant="h5" gutterBottom>
        🔐 Change Password
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Whitetextfield
            label="Current Password"
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
            fullWidth
          />
          <Whitetextfield
            label="New Password"
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            fullWidth
          />
          <Whitetextfield
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </Stack>
      </Box>

      {(successMessage || error || form.newPassword !== form.confirmPassword) && (
  <Snackbar
    open={openSnackbar}
    autoHideDuration={3000}
    onClose={handleCloseSnackbar}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <Alert
      onClose={handleCloseSnackbar}
      severity={
        successMessage
          ? "success"
          : error
          ? "error"
          : "warning"
      }
      variant="filled"
      sx={{ width: "100%" }}
    >
      {successMessage
        ? successMessage
        : error
        ? error === "Request failed with status code 400"
          ? "Invalid current password"
          : error
        : "New passwords do not match"}
    </Alert>
  </Snackbar>
)}
    </PaperWrapper>
  );
};

export default Setting;
