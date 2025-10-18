"use client";
import React from "react";
import { setLanguage } from "@/app/redux/store/language";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store/store";

const LanguagePage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const language = useSelector((state: RootState) => state.language.language);

  const handleLanguage = () => {
    const newLanguage = !language;
    dispatch(setLanguage(newLanguage));
  };

  return (
    <div className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm font-mono mb-5 ">
      <div className="flex justify-between p-6">
        <p className="rounded p-1 ">{language ? "Language" : "Dil Seçeneği"}</p>
        <button className="rounded p-1 " onClick={() => handleLanguage()}>
          {language ? "English" : "Türkçe"}
        </button>
      </div>
    </div>
  );
};

export default LanguagePage;
