/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile, Profile, updateProfile } from '../../services/profile';
import { RootState } from '../store';

interface ProfileState {
  user: any;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  message:string|null;
}

const initialState: ProfileState = {
  user: null,
  profile: null,
  loading: false,
  error: null,
  message:null
};

// Get user + profile
export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async ( _,thunkAPI) => {
    try {
      return await getProfile();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error fetching profile');
    }
  }
);

// Update profile
export const saveProfile = createAsyncThunk(
  'profile/update',
  async ({ profile }: { profile: Profile }, thunkAPI) => {
    try {
      const response= await updateProfile(profile);

      return{
        data:response,
        message:response.message
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error updating profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers:{
    clearMessages: (state) => {
        state.error = null;
        state.message = null;
        state.loading = false;
    }
},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProfile.pending, (state) => {
        state.loading=true
        state.error = null;
        state.message = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(saveProfile.pending, (state) => {
        state.loading=true
            state.error = null;
            state.message = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.message=action.payload.message
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = profileSlice.actions;
export const selectProfile = (state: RootState) => state.profile;

export default profileSlice.reducer;
