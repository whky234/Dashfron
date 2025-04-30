import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isTokenExpired } from "../../utils/tokenutils";
import { GetCurrentUser, login, newpass, register } from "./auththunk";

interface AuthState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

// Safely parse localStorage data
const getLocalStorageUser = () => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (token && isTokenExpired(token)) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }

  return user && user !== "undefined" ? JSON.parse(user) : null;
};

const initialState: AuthState = {
  user: getLocalStorageUser(),
  token:
    localStorage.getItem("token") &&
    !isTokenExpired(localStorage.getItem("token")!)
      ? localStorage.getItem("token")
      : null,
  loading: false,
  error: null,
  success: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        _id: string;
        name: string;
        email: string;
        role: string;
        token: string;
      }>
    ) => {
      state.user = {
        _id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role,
      };
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
        };
        state.token = action.payload.token;
        state.success = action.payload.message || "Registered successfully";
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = null;
      })

      // Login user
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
        };
        state.token = action.payload.token;
        state.success = action.payload.message || "Login successful";
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = null;
      })

      // Get Current User
      .addCase(GetCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(GetCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
        };
        state.token = action.payload.token;
        state.success = action.payload.message || "User loaded successfully";
      })
      .addCase(GetCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = null;
      })

      // Update Password
      .addCase(newpass.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(newpass.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Password updated successfully";
      })
      .addCase(newpass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = null;
      });
  },
});

export const { setCredentials, logout, setError, setLoading, setSuccess } =
  authSlice.actions;

export default authSlice.reducer;
