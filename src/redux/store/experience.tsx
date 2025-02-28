"use client";
import { createSlice } from "@reduxjs/toolkit";

export interface Experience {
  _id?: string;
  title: string;
  time: string;
  company: string;
  details: string[]; 
  createdAt?: string; 
}

interface ExperienceState {
  experiences: Experience[];
}

const initialState: ExperienceState = {
  experiences: [],
};

const educationSlice = createSlice({
  name: "experience",
  initialState,
  reducers: {
    setExperienceData: (state, action) => {
      state.experiences = action.payload;
    },
  },
});

export const { setExperienceData } = educationSlice.actions;
export default educationSlice.reducer;
