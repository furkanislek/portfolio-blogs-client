"use client";
import { createSlice } from "@reduxjs/toolkit";

export interface Education {
  _id: string;
  title: string;
  description: string | null;
  company: string;
  time: string;
  createdAt: string;
}

interface EducationState {
  educationsData: Education[];
}

const initialState: EducationState = {
  educationsData: []
};

const educationSlice = createSlice({
  name: "education",
  initialState,
  reducers: {
    setEducationData: (state, action) => {
      state.educationsData = action.payload;
    }
  },
});

export const { setEducationData } =  educationSlice.actions;
export default educationSlice.reducer;
