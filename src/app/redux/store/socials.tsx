"use client";
import { createSlice } from "@reduxjs/toolkit";

export interface Socials {
  _id?: string;
  img: string;
  href: string;
  title: string;
  address: string;
  createdAt: string;
}

interface SocialsState {
  socialsData: Socials[];
}

const initialState: SocialsState = {
  socialsData: [],
};

const socialsSlice = createSlice({
  name: "socials",
  initialState,
  reducers: {
    setSocialsData: (state, action) => {
      state.socialsData = action.payload;
    },
  },
});

export const { setSocialsData } = socialsSlice.actions;
export default socialsSlice.reducer;
