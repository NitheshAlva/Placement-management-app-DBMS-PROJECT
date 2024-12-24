import { createSlice } from '@reduxjs/toolkit';
import studentService from '../supabase/StudentService';

const initialState = {
  status: 'unauthenticated',
  role: null,
  data: null, // This will be USN for students or employee_id for employers
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.status = 'authenticated';
      state.role = action.payload.role;
      state.data = action.payload.data;
    },
    setUnauthenticated: (state) => {
      state.status = 'unauthenticated';
      state.role = null;
      state.data = null;
    },
  },
});

export const { setAuthenticated, setUnauthenticated } = authSlice.actions;

export default authSlice.reducer;

