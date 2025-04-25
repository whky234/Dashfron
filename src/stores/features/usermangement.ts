
import { createAsyncThunk, createSlice,PayloadAction } from "@reduxjs/toolkit"
import { getusers,adduser,deleteuser,edituser,changerole,changestatus } from "../../services/authser"

interface User{
    _id:string,
    name:string,
    email:string
    role:string,
    status:string,
    createdAt:string
}

interface userState{
    users:User[],
    loading:boolean,
    error:string|null
}

const initialState:userState={
    users:[],
    loading:false,
    error:null

}

export const Fetchuser = createAsyncThunk(
    'users/Fetchuser',
    async (_, { rejectWithValue }) => { // `_` is used because we don't need an argument
      try {
        return await getusers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );

  export const Adduser = createAsyncThunk(
    'users/Adduser',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (userData:any, { rejectWithValue }) => { // `_` is used because we don't need an argument
      try {
        return await adduser(userData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );

  export const Deleteuser = createAsyncThunk(
    'users/Deleteuser',
    async (id:string, { rejectWithValue }) => { // `_` is used because we don't need an argument
      try {
        return await deleteuser(id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );
  

  export const Edituser = createAsyncThunk(
    'users/Edituser',
    async ({id,userData}:{id:string,userData:{name:string,email:string,role:string,status:string}}, { rejectWithValue }) => { // `_` is used because we don't need an argument
      try {
        return await edituser(id,userData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );


  export const ChangeStatus = createAsyncThunk(
    'users/ChangeStatus',
    async ({id,status}:{id:string,status:string}, { rejectWithValue }) => { // `_` is used because we don't need an argument
      try {
        return await changestatus(id,status);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );

  export const ChangeRole = createAsyncThunk(
    'users/ChangeRole',
    async ({id,role}:{id:string,role:string}, { rejectWithValue }) => { // `_` is used because we don't need an argument
      try {
        return await changerole(id,role);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );


  const UserManagementreducer=createSlice({
    name:"userManagement",
    initialState,
    reducers:{
      clearError: (state) => {
        state.error = null;
      },
    },
    extraReducers:(builders)=>{
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        builders
        .addCase(Fetchuser.pending,(state)=>{
            state.loading=true
        })
        .addCase(Fetchuser.fulfilled,(state,action:PayloadAction<User[]>)=>{
            state.loading=false;
            state.users=action.payload;
        })
        .addCase(Fetchuser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })
        .addCase(Adduser.pending,(state)=>{
            state.loading=true
        })
        .addCase(Adduser.fulfilled,(state,action:PayloadAction<User>)=>{
            state.loading=false;
            state.users.push(action.payload)
         })
        .addCase(Adduser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })
        .addCase(Deleteuser.pending,(state)=>{
            state.loading=true
        })
        .addCase(Deleteuser.fulfilled,(state,action:PayloadAction<User>)=>{
            state.loading=false;
            state.users=state.users.filter((user)=>user._id!==action.payload._id)
         })
        .addCase(Deleteuser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })
        .addCase(Edituser.pending,(state)=>{
            state.loading=true
        })
        .addCase(Edituser.fulfilled,(state,action:PayloadAction<User>)=>{
            state.loading=false;
          const index=state.users.findIndex((user)=>user._id===action.payload._id);
          if(index!==-1){
            state.users[index]=action.payload
          }
         })
        .addCase(Edituser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })

        .addCase(ChangeRole.pending,(state)=>{
            state.loading=true
        })
        .addCase(ChangeRole.fulfilled,(state,action:PayloadAction<User>)=>{
            state.loading=false;
          const index=state.users.findIndex((user)=>user._id===action.payload._id);
          if(index!==-1){
            state.users[index].role=action.payload.role
          }
         })
        .addCase(ChangeRole.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })

        .addCase(ChangeStatus.pending,(state)=>{
            state.loading=true
        })
        .addCase(ChangeStatus.fulfilled,(state,action:PayloadAction<User>)=>{
            state.loading=false;
          const index=state.users.findIndex((user)=>user._id===action.payload._id);
          if(index!==-1){
            state.users[index].status=action.payload.status
          }
         })
        .addCase(ChangeStatus.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })

        
    }
  })

  export const { clearError } = UserManagementreducer.actions;

export default UserManagementreducer.reducer;