"use client";
import { createSlice } from "@reduxjs/toolkit";

export interface Experience {
  _id?: string;
  title: string;
  trTitle: string;
  time: string;
  trTime: string;
  company: string;
  trCompany: string;
  details: string[];
  trDetails: string[];
  createdAt?: string;
}

interface ExperienceState {
  experiences: Experience[];
  loading: boolean;
}

const initialState: ExperienceState = {
  experiences: [],
  loading: true,
};

const educationSlice = createSlice({
  name: "experience",
  initialState,
  reducers: {
    setExperienceData: (state, action) => {
      state.experiences = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setExperienceData, setLoading } = educationSlice.actions;
export default educationSlice.reducer;
