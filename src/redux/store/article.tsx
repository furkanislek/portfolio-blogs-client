"use client";
import { createSlice } from "@reduxjs/toolkit";

interface ArticleState {
  articleData: any;
  idArticleData: any;
  articleId: any;
}

const initialState: ArticleState = {
  articleData: null,
  idArticleData: null,
  articleId: null,
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
  },
});

export const { setArticleData, setIdArticleData, setArticleId } =
  articleSlice.actions;
export default articleSlice.reducer;
