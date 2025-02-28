"use client";
import { createSlice } from "@reduxjs/toolkit";

export interface TechStack {
  _id?: string;
  name: string;
  createdAt: string;
}

interface TechStackState {
  techStackData: TechStack[];
}

const initialState: TechStackState = {
  techStackData: [],
};

const techStackSlice = createSlice({
  name: "techStack",
  initialState,
  reducers: {
    setTechStackData: (state, action) => {
      state.techStackData = action.payload;
    },
  },
});

export const { setTechStackData } = techStackSlice.actions;
export default techStackSlice.reducer;
