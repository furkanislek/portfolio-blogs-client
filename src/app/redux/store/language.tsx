import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
  language: boolean;
}

const initialState: LanguageState = {
  language: true,
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<boolean>) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
