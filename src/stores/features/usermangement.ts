/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getusers, adduser, deleteuser, edituser, changerole, changestatus } from "../../services/authser";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  message: null,
};

// ✅ Async Thunks

export const Fetchuser = createAsyncThunk('users/Fetchuser', async (_, { rejectWithValue }) => {
  try {
    return await getusers(); // expected to return an array of users
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message );
  }
});

export const Adduser = createAsyncThunk('users/Adduser', async (userData: any, { rejectWithValue }) => {
  try {
    const response = await adduser(userData);
    console.log(response)
    return {
      data: response,
      message: response.message || 'User added successfully',
    };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const Deleteuser = createAsyncThunk('users/Deleteuser', async (id: string, { rejectWithValue }) => {
  try {
    const response = await deleteuser(id);
    return {
      data: response, // expect backend to return deleted user or ID
      message: response.message || 'User deleted successfully',
    };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message );
  }
});

export const Edituser = createAsyncThunk(
  'users/Edituser',
  async (
    { id, userData }: { id: string; userData: { name: string; email: string; role: string; status: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await edituser(id, userData);
      return {
        data: response,
        message: response.message || 'User updated successfully',
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message );
    }
  }
);

export const ChangeStatus = createAsyncThunk(
  'users/ChangeStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await changestatus(id, status);
      console.log(response)

      return {
        data: response,
        message: response.message || 'Status updated successfully',
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const ChangeRole = createAsyncThunk(
  'users/ChangeRole',
  async ({ id, role }: { id: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await changerole(id, role);
      return {
        data: response,
        message: response.message || 'Role updated successfully',
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message );
    }
  }
);

// ✅ Slice

const UserManagementreducer = createSlice({
  name: "userManagement",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(Fetchuser.pending, (state) => {
        state.loading=true
        state.error = null;
        state.message = null;
      })
      .addCase(Fetchuser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(Fetchuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add
      .addCase(Adduser.pending, (state) => {
        state.loading=true
        state.error = null;
        state.message = null;
      })
      .addCase(Adduser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload.data);
        state.message = action.payload.message;
      })
      .addCase(Adduser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(Deleteuser.pending, (state) => {
        state.loading=true
        state.error = null;
        state.message = null;
      })
      .addCase(Deleteuser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.data._id;
        state.users = state.users.filter((user) => user._id !== deletedId);
        state.message = action.payload.message;
      })
      .addCase(Deleteuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Edit
      .addCase(Edituser.pending, (state) => {
        state.loading=true
        state.error = null;
        state.message = null;
      })
      .addCase(Edituser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.data;
        const index = state.users.findIndex((user) => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        state.message = action.payload.message;
      })
      .addCase(Edituser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Change Role
      .addCase(ChangeRole.pending, (state) => {
        state.loading=true
        state.error = null;
        state.message = null;
      })
      .addCase(ChangeRole.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.data;
        const index = state.users.findIndex((user) => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index].role = updatedUser.role;
        }
        state.message = action.payload.message;
      })
      .addCase(ChangeRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Change Status
      .addCase(ChangeStatus.pending, (state) => {
        state.loading=true
        state.error = null;
        state.message = null;
      })
      .addCase(ChangeStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.data;
        const index = state.users.findIndex((user) => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index].status = updatedUser.status;
        }
        state.message = action.payload.message;
      })
      .addCase(ChangeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = UserManagementreducer.actions;
export default UserManagementreducer.reducer;
