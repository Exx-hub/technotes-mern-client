import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    storeCredentials: (state, action) => {
      const { token } = action.payload;

      state.token = token;
    },
    clearCredentials: (state) => {
      state.token = null;
    },
  },
});

export const { storeCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.authState.user;
export const selectCurrentToken = (state) => state.authState.token;
