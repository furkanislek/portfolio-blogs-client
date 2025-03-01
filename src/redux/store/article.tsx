"use client";
import { createSlice } from "@reduxjs/toolkit";

interface ArticleState {
  articleData: any;
  idArticleData: any;
  articleId: any;
  filteredData: any;
}

const initialState: ArticleState = {
  articleData: null,
  idArticleData: null,
  articleId: null,
  filteredData: null,
};

const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    setArticleData: (state, action) => {
      state.articleData = action.payload;
    },
    setIdArticleData: (state, action) => {
      state.idArticleData = action.payload;
    },
    setArticleId: (state, action) => {
      state.articleId = action.payload;
    },
    setFilteredData: (state, action) => {
      state.filteredData = action.payload;
    },
  },
});

export const {
  setArticleData,
  setIdArticleData,
  setArticleId,
  setFilteredData,
} = articleSlice.actions;
export default articleSlice.reducer;
