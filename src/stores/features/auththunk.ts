import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginuser, registeruser, newpassword } from "../../services/authser";
import { setCredentials } from "./authslice";

export const register = createAsyncThunk(
  'auth/register', 
  async (userData: { name: string; email: string; password: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await registeruser(userData);
      return {
        data: response,
        message: response.message,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    userData: { email: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await loginuser(userData);
      const { _id, name, email, role, token } = response;

      // Save credentials to Redux + localStorage
      dispatch(setCredentials({ _id, name, email, role, token }));

      return {
        data: response,
        message: response.message,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const newpass = createAsyncThunk(
  'auth/newpass',
  async (userData: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await newpassword(userData);
      return {
        data: response,
        message: response.message,
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Password update failed");
    }
  }
);