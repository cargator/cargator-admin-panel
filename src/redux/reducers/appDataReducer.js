import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    sukam:{}
}

export const appDataSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppData:(state,action) => {
      state.sukam = {...state.sukam,...action.payload}
    }
  },
})

export const { setAppData } = appDataSlice.actions

export default appDataSlice.reducer