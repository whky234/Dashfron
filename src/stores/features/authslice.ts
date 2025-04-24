import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isTokenExpired } from "../../utils/tokenutils";

interface AuthState {
  user: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Safely parse localStorage data
// Updated logic to include token expiration check
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
  user: getLocalStorageUser(), // Use the safe parser
  token: localStorage.getItem("token") && !isTokenExpired(localStorage.getItem("token")!) 
  ? localStorage.getItem("token") 
  : null,  loading: false,
  error: null,
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
  },
});

export const { setCredentials, logout, setError, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
