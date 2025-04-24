import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCredentials, setError, setLoading } from "./authslice";
import { loginuser, registeruser,getCurrent, newpassword } from "../../services/authser";




export const register = createAsyncThunk(
    'auth/register', // Use a unique action type
    async (userData: { name: string; email: string; password: string; role: string }, { dispatch }) => {
      try {
        dispatch(setLoading(true));
        const response = await registeruser(userData); // Call the API
        dispatch(setCredentials({  _id: response._id,
            name: response.name,
            email: response.email,
            role: response.role || 'user', // Default role if not provided
            token: response.token, })); // Update Redux state
        dispatch(setLoading(false));
        return response; // Return the response for extraReducers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
        dispatch(setError(errorMessage)); // Handle errors
        dispatch(setLoading(false));
        throw err; // Re-throw the error for extraReducers
      }
    }
  );


  export const login = createAsyncThunk(
    'auth/login', // Use a standard action type
    async (userdata: { email: string; password: string }, { dispatch }) => {
      try {
        dispatch(setLoading(true));
        const response = await loginuser(userdata);
  
        // Debugging logs
        console.log("API Response:", response);
        console.log("User from API:", response);
        console.log("Token from API:", response.token);
  
        dispatch(setCredentials({  _id: response._id,
            name: response.name,
            email: response.email,
            role: response.role || 'user', // Default role if not provided
            token: response.token, }));
        dispatch(setLoading(false));
        return response; // Return the response for extraReducers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Login failed';
        dispatch(setError(errorMessage)); // Handle errors
        dispatch(setLoading(false));
        throw err; // Re-throw the error for extraReducers
      }
    }
  );

  export const newpass = createAsyncThunk(
    'auth/newpass',
    async (
      userData: { currentPassword: string; newPassword: string },
      { dispatch }
    ) => {
      try {
        dispatch(setLoading(true));
        const response = await newpassword(userData); // Your API call (in `authser.ts`)
        dispatch(setLoading(false));
        return response; // You can handle this in `extraReducers` if needed
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Password update failed';
        dispatch(setError(errorMessage));
        dispatch(setLoading(false));
        throw err;
      }
    }
  );
  

  export const GetCurrentUser = createAsyncThunk(
    "auth/GetCurrentUser",
    async (_, { dispatch }) => {
      try {
        dispatch(setLoading(true));
        const response = await getCurrent(); // Call the API to get current user
  
        // Debugging logs
        console.log("Current User API Response:", response);
  
        dispatch(
          setCredentials({
            _id: response._id,
            name: response.name,
            email: response.email,
            role: response.role || "user",
            token: response.token,
          })
        );
  
        dispatch(setLoading(false));
        return response; // Return for extraReducers
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || "Failed to fetch user";
        dispatch(setError(errorMessage)); // Handle errors
        dispatch(setLoading(false));
        throw err; // Re-throw the error for extraReducers
      }
    }
  );