import React, {  useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { register } from "../../stores/features/auththunk";
import { RootState, AppDispatch } from "../../stores/store";
import Handlemessages from "../../hooks/Handlemessage";
import { clearMessages } from "../../stores/features/authslice";

interface Registerprops{
  setSnackBar:React.Dispatch<React.SetStateAction<{message:string,severity:'success'|'error'}|null>>;
}
export const Register: React.FC<Registerprops> = ({setSnackBar}) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user");

  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector(
    (state: RootState) => state.auth
  );



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(register({ name, email, password, role }));
     navigate("/login");

  };

  

  Handlemessages({
    message,
    error,
    clearMessageAction: clearMessages,
    setSnackBar,
    dispatch,
  });
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

      
    </Container>
  );
};
