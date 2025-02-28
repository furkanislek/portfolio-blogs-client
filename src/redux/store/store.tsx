"use client";

import userReducer from "./user";
import articleReducer from "./article";
import socialsReducer from "./socials";
import projectReducer from "./projects";
import educationReducer from "./education";
import techStackReducer from "./techStack";
import experienceReducer from "./experience";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    user: userReducer,
    socials:socialsReducer,
    project:projectReducer,
    article: articleReducer,
    techStack:techStackReducer,
    education: educationReducer,
    experience: experienceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;