"use client";
import { createSlice } from "@reduxjs/toolkit";

export interface Projects {
  _id?: string;
  href: string;
  liveHref: string;
  imgSrc: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
}

interface ProjectsState {
  projectsData: Projects[];
}

const initialState: ProjectsState = {
  projectsData: [],
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjectData: (state, action) => {
      state.projectsData = action.payload;
    },
  },
});

export const { setProjectData } = projectSlice.actions;
export default projectSlice.reducer;
