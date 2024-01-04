import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sideBarState: true,
}

export const stateChangeSlice = createSlice({
  name: 'sideBarStateChange',
  initialState,
  reducers: {
    setSideBarState: (state, action) => {
      state.sideBarState = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setSideBarState } = stateChangeSlice.actions

export default stateChangeSlice.reducer
