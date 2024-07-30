import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
  email: null,
  super_Admin:false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
    },
    setEmail: (state, action) => { // New reducer for setting email
      state.email = action.payload
    },
    setSuper_Admin: (state, action) => { 
      state.super_Admin = action.payload
    },
  },
})

export const { setToken,setEmail,setSuper_Admin } = authSlice.actions

export default authSlice.reducer