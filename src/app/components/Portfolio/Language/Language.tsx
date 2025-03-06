"use client";
import React, { useEffect } from "react";
import { setLanguage } from "@/redux/store/language";
import { useDispatch, useSelector } from "react-redux";
import { decryptData, encryptData } from "@/app/api/crypto";
import { AppDispatch, RootState } from "@/redux/store/store";

const LanguagePage = () => {
const dispatch = useDispatch<AppDispatch>();

const cacheKey = "cache_language";

const language = useSelector((state: RootState) => state.language.language);

const handleLanguage = () => {
  const newLanguage = !language; 
  dispatch(setLanguage(newLanguage));
  const encryptedData = encryptData(newLanguage.toString()); 
  localStorage.setItem(cacheKey, encryptedData); 
};

useEffect(() => {
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    const decryptedData = decryptData(cachedData);
    if (decryptedData === "true" || decryptedData === "false") {
      dispatch(setLanguage(decryptedData === "true"));
    }
  }
}, [dispatch]);

  return (
    <div className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm font-mono mb-5 ">
      <div className="flex justify-between p-6">
        <p className="rounded p-1 ">
          {language  ? "Language" : "Dil Seçeneği"}
        </p>
        <button className="rounded p-1 " onClick={() => handleLanguage()}>
          {language  ? "English" : "Türkçe"}
        </button>
      </div>
    </div>
  );
};

export default LanguagePage;
