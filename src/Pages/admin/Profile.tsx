import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  
  Typography,
 
  CircularProgress,
  MenuItem,
  Avatar,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../stores/store";
import {
  clearMessages,
  fetchProfile,
  saveProfile,
  selectProfile,
} from "../../stores/features/profileslice";
import { Profile } from "../../services/profile";
import PaperWrapper from "./paper";
import Whitetextfield from "./whiteTextfield";
import Handlemessages from "../../hooks/Handlemessage";

interface Profileprops{
  setSnackBar:React.Dispatch<React.SetStateAction<{message:string,severity:'success'|'error'}|null>>;
}

const ProfileForm: React.FC<Profileprops> = ({setSnackBar}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading,message,error } = useSelector(selectProfile);

  

  const [formData, setFormData] = useState<Profile>({
    username: "",
    profilePicture: "",
    phone: "",
    bio: "",
    location: "",
    dateOfBirth: "",
    gender: "", // changed from undefined to ""
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
          gender: profile.gender || "", // also set to "" instead of undefined
        });
    }
  }, [profile]);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  Handlemessages({
    message,
    error,
    clearMessageAction: clearMessages,
    setSnackBar,
    dispatch,
  });

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
   await dispatch(saveProfile({ profile: formData }));

    

    dispatch(fetchProfile());
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 0 }}>
     
      <Grid container spacing={3}>
  {/* LEFT PROFILE CARD */}
  <Grid item xs={12} md={4}>
    <PaperWrapper
     
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
      <Typography variant="body2">
        {formData.location || "Location"}
      </Typography>
      <Divider sx={{ width: "100%", my: 2, backgroundColor:'white' }} />
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
    </PaperWrapper>
  </Grid>

  {/* RIGHT PROFILE FORM */}
  <Grid item xs={12} md={8}>
    <PaperWrapper sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {profile ? "Edit Profile" : "Create Profile"}
      </Typography>
      <Typography variant="body2"  gutterBottom>
        Update your personal information below
      </Typography>
      <Divider sx={{ mb: 3  ,backgroundColor:'white'}} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Whitetextfield
            label="Username"
            name="username"
            fullWidth
            value={formData.username}
            onChange={handleChange}

          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Whitetextfield
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            fullWidth
            value={formData.dateOfBirth}
            onChange={handleChange}
            
            />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Whitetextfield
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
          </Whitetextfield>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Whitetextfield
            name="phone"
            label="Phone"
            fullWidth
            value={formData.phone}
            onChange={handleChange}

          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Whitetextfield
            name="location"
            label="Location"
            fullWidth
            value={formData.location}
            onChange={handleChange}

          />
        </Grid>

        <Grid item xs={12}>
          <Whitetextfield
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

      <Divider sx={{ mt: 4, mb: 2 ,backgroundColor:'white'}} />

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ textTransform: "none", borderRadius: 2, minWidth: 140 }}
        >
          {loading ? <CircularProgress size={22} color="primary" /> : "Save Profile"}
        </Button>
      </Box>
    </PaperWrapper>
  </Grid>
</Grid>
     
    </Container>
  );
};

export default ProfileForm;



