"use client";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  userInformation: any;
}

const initialState: UserState = {
  userInformation: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInformation: (state, action) => {
      state.userInformation = action.payload;
    },
  },
});

export const { setUserInformation } = userSlice.actions;
export default userSlice.reducer;
