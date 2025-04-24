import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import { Adduser, Edituser } from "../../stores/features/usermangement";
import { RootState } from "../../stores/store";

const AddUser: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [status, setStatus] = useState("active");
  // const [error, setError] = useState("");
  // const [success, setSuccess] = useState("");
    const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
  

  const { users } = useSelector((state: RootState) => state.userManagement);
  const existingUser = id ? users.find((user) => user._id === id) : null;

  useEffect(() => {
    if (existingUser) {
      setName(existingUser.name);
      setEmail(existingUser.email);
      setRole(existingUser.role);
      setStatus(existingUser.status || "active");
    }
  }, [existingUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !role) {
      // setError("Please fill in all fields");
      return;
    }

    try {
      let resultAction;

      if (id) {
        // Edit existing user
        resultAction = await dispatch(
          Edituser({
            id,
            userData: {
              name,
              email,
              role,
              status,
            },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }) as any
        );

          if(Edituser.fulfilled.match(resultAction)){
            setSnackbar({ message: resultAction.payload.message, severity: 'success' });

          }else{
            setSnackbar({ message: resultAction.payload as string, severity: 'error' });

          }
       
      } else {
        // Add new user
        resultAction = await dispatch(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Adduser({ name, email, role }) as any
        );

        if(Edituser.fulfilled.match(resultAction)){
          setSnackbar({ message: resultAction.payload.message, severity: 'success' });

        }else{
          setSnackbar({ message: resultAction.payload as string, severity: 'error' });

        }
      }

      

      setName("");
      setEmail("");
      setRole("user");
      setStatus("active");

      setTimeout(() => {
        navigate("/admin/users");
      }, 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (err: any) {
      //
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 600 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {id ? "Edit User" : "Add New User"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  label="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

           
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
           

           
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {id ? "Update User" : "Add User"}
              </Button>
            </Grid>
          </Grid>
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
    </Box>
  );
};

export default AddUser;
