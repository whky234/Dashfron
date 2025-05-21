import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Adduser,
  clearMessages,
  Edituser,
} from "../../stores/features/usermangement";
import { RootState } from "../../stores/store";
import PaperWrapper from "../../hooks/paper";
import Whitetextfield from "../../hooks/whiteTextfield";
import Handlemessages from "../../hooks/Handlemessage";

interface Adduserprops {
  setSnackBar: React.Dispatch<
    React.SetStateAction<{
      message: string;
      severity: "success" | "error";
    } | null>
  >;
}
const AddUser: React.FC<Adduserprops> = ({ setSnackBar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [status, setStatus] = useState("active");

  const { users, loading, message, error } = useSelector(
    (state: RootState) => state.userManagement
  );
  const existingUser = id ? users.find((user) => user._id === id) : null;

  useEffect(() => {
    if (existingUser) {
      setName(existingUser.name);
      setEmail(existingUser.email);
      setRole(existingUser.role);
      setStatus(existingUser.status || "active");
    }
  }, [existingUser]);

  Handlemessages({
    message,
    error,
    clearMessageAction: clearMessages,
    setSnackBar,
    dispatch,
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !role) {
      return;
    }

    try {
      if (id) {
        // Edit user
        await dispatch(
          Edituser({
            id,
            userData: { name, email, role, status },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }) as any
        );
      } else {
        // Add user
        await dispatch(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Adduser({ name, email, role }) as any
        );
      }

      setTimeout(() => {
        navigate("/admin/users");
      }, 1500); // Delay navigation to allow Snackbar to show

      setName("");
      setEmail("");
      setRole("user");
      setStatus("active");

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
      <PaperWrapper
        elevation={3}
        sx={{ padding: 4, width: "100%", maxWidth: 600 }}
      >
        <Typography variant="h5" align="center" sx={{ mb: 3 }} gutterBottom>
          {id ? "Edit User" : "Add New User"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Whitetextfield
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="textfield-Name" // <-- Add this line
              />
            </Grid>
            <Grid item xs={12}>
              <Whitetextfield
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="textfield-email" // <-- Add this line
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="role-label" sx={{ color: "white" }}>
                  Role
                </InputLabel>
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  sx={{ color: "white" }}
  data-testid="textfield-role"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="status-label" sx={{ color: "white" }}>
                  Status
                </InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{ color: "white" }}
                  data-testid="textfield-status"

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
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : id ? (
                  "Update User"
                ) : (
                  "Add User"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </PaperWrapper>
    </Box>
  );
};

export default AddUser;
