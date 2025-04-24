import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../stores/store";
import {
  fetchProfile,
  saveProfile,
  selectProfile,
} from "../../stores/features/profileslice";
import { Profile } from "../../services/profile";

const ProfileForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useSelector(selectProfile);

  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState<Profile>({
    username: "",
    profilePicture: "",
    phone: "",
    bio: "",
    location: "",
    dateOfBirth: "",
    gender: undefined,
  });
  

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        profilePicture: profile.profilePicture || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        location: profile.location || "",
        dateOfBirth: profile.dateOfBirth
          ? profile.dateOfBirth.slice(0, 10)
          : "",
        gender: profile.gender || undefined,
      });
    }
  }, [profile]);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const result = await dispatch(saveProfile({ profile: formData }));

    if (saveProfile.fulfilled.match(result)) {
      setSnackbar({ message: result.payload.message, severity: "success" });
    } else {
      setSnackbar({ message: result.payload as string, severity: "error" });
    }

    dispatch(fetchProfile());
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Typography
        variant="h4"
        sx={{ textAlign: "left" }}
        fontWeight={600}
        gutterBottom
      >
        Account
      </Typography>
      <Grid container spacing={3}>
  {/* LEFT PROFILE CARD */}
  <Grid item xs={12} md={4}>
    <Paper
      elevation={3}
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 3,
      }}
    >
      <Avatar
        src={formData.profilePicture}
        alt={formData.username}
        sx={{ width: 100, height: 100, mb: 2 }}
      />
      <Typography variant="h6" fontWeight={600}>
        {formData.username || "Your Name"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {formData.location || "Location"}
      </Typography>
      <Divider sx={{ width: "100%", my: 2 }} />
      <Button variant="outlined" size="small" component="label">
        Upload picture
        <input
          hidden
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChange}
        />
      </Button>
    </Paper>
  </Grid>

  {/* RIGHT PROFILE FORM */}
  <Grid item xs={12} md={8}>
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {profile ? "Edit Profile" : "Create Profile"}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Update your personal information below
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Username"
            name="username"
            fullWidth
            value={formData.username}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            fullWidth
            value={formData.dateOfBirth}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            name="gender"
            label="Gender"
            fullWidth
            value={formData.gender}
            onChange={handleChange}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="phone"
            label="Phone"
            fullWidth
            value={formData.phone}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="location"
            label="Location"
            fullWidth
            value={formData.location}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="bio"
            label="Bio"
            fullWidth
            multiline
            rows={3}
            value={formData.bio}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Divider sx={{ mt: 4, mb: 2 }} />

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ textTransform: "none", borderRadius: 2, minWidth: 140 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Save Profile"}
        </Button>
      </Box>
    </Paper>
  </Grid>
</Grid>
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

export default ProfileForm;
