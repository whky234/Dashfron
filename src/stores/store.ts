import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authslice';
import UserManagementreducer from './features/usermangement';
import Productslice from './features/productslice'
import profileReducer from './features/profileslice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userManagement:UserManagementreducer,
    product:Productslice,
    profile: profileReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;