/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {  useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import { clearMessages, setError, setMessage } from "../../stores/features/authslice";
import Handlemessages from "../../hooks/Handlemessage";
interface setpasswordprops{
  setSnackBar:React.Dispatch<React.SetStateAction<{message:string,severity:'success'|'error'}|null>>;
}
const SetPassword: React.FC<setpasswordprops> = ({setSnackBar}) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const { message, error } = useSelector((state: RootState) => state.auth);


  Handlemessages({
    message,
    error,
    clearMessageAction: clearMessages,
    setSnackBar,
    dispatch,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setSnackBar({ message: "Passwords do not match", severity: "error" });
      return;
    }

    try {
      const response = await axios.post(
        "https://dashboardproducts-ff5e09c8bf17.herokuapp.com/api/auth/set-password",
        { token, password }
      );

      dispatch(setMessage(response.data.message));
      setTimeout(() => navigate("/login"), 2000);

    } catch (err: any) {
      dispatch(
        setError(err.response?.data?.message || "Failed to set password")
      );
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
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Set Password
          </Button>
        </form>
      </Paper>

      
    </Box>
  );
};

export default SetPassword;
