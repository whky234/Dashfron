import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isTokenExpired } from "../../utils/tokenutils";
import { login, newpass, register } from "./auththunk";

interface AuthState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any; // eslint-disable-next-line @typescript-eslint/no-explicit-any
  token: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

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
  message: null,
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
    clearMessages: (state) => {
      state.error = null;
      state.message = null;
      state.loading=false;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        
        state.message = action.payload.message || "Registration successful";
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login user
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const { _id, name, email, role, token } = action.payload.data;
        state.user = { _id, name, email, role };
        state.token = token;
        state.message = action.payload.message || "Login successful";
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Password
      .addCase(newpass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(newpass.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Password updated successfully";
      })
      .addCase(newpass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, logout, clearMessages,setMessage,setError } = authSlice.actions;

export default authSlice.reducer;