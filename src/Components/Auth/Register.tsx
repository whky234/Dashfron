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
  // Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { register } from "../../stores/features/auththunk";
import { RootState } from "../../stores/store";
import { setError } from "../../stores/features/authslice";

export const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [success, setSuccess] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // Clear error after 2 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(setError(null));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(register({ name, email, password, role }) as any)
      .unwrap()
      .then(() => {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch(() => {
        // Error is already handled by the thunk
      });
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
                Welcome  👋
              </Typography>
              <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
                Please Register to your account
              </Typography>
    
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
               Registration successful! Redirecting...
    </Alert>
              )}
    
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
             onChange={(e) => setRole(e.target.value as string)}
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
    // <Box
    //   sx={{
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     minHeight: "100%",
    //     // backgroundColor: "#f5f5f5", // Light background for the page
    //   }}
    // >
    //   <Container maxWidth="xs">
    //     <Paper
    //       elevation={6}
    //       sx={{
    //         padding: 4,
    //         borderRadius: 2,
    //         backgroundColor: "rgba(249, 230, 192, 0.29)", // Semi-transparent white
    //         boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    //       }}
    //     >
    //       <Typography variant="h4" align="center" gutterBottom>
    //         Register
    //       </Typography>
    //       {error && (
    //         <Alert severity="error" sx={{ mb: 2 }}>
    //           {error}
    //         </Alert>
    //       )}
    //       {success && (
    //         <Alert severity="success" sx={{ mb: 2 }}>
    //           Registration successful! Redirecting...
    //         </Alert>
    //       )}
    //       <form onSubmit={handleSubmit}>
    //         <TextField
    //           label="Name"
    //           size="small"
    //           value={name}
    //           onChange={(e) => setName(e.target.value)}
    //           fullWidth
    //           margin="normal"
    //           required
    //           sx={{ mb: 2 }}
    //         />
    //         <TextField
    //           label="Email"
    //           size="small"
    //           type="email"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           fullWidth
    //           margin="normal"
    //           required
    //           sx={{ mb: 2 }}
    //         />
    //         <TextField
    //           label="Password"
    //           size="small"
    //           type="password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           fullWidth
    //           margin="normal"
    //           required
    //           sx={{ mb: 2 }}
    //         />
    //        <FormControl fullWidth margin="normal" required sx={{ mb: 3 }}>
    //           <InputLabel id="role-label">Role</InputLabel>
    //           <Select
    //             labelId="role-label"
    //             label="Role"
    //             value={role}
    //             onChange={(e) => setRole(e.target.value as string)}
    //             size="small"
    //           >
    //             <MenuItem value="user">User</MenuItem>
    //             <MenuItem value="admin">Admin</MenuItem>
    //           </Select>
    //         </FormControl>
    //         <Button
    //           type="submit"
    //           variant="contained"
    //           color="primary"
    //           fullWidth
    //           disabled={loading}
    //           sx={{ py: 1.5 }}
    //         >
    //           {loading ? <CircularProgress size={24} /> : "Register"}
    //         </Button>
    //       </form>
    //     </Paper>
    //   </Container>
    // </Box>
  );
};