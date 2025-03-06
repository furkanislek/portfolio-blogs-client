"use client";
import React from "react";
import { useSelector } from "react-redux";
import Biography from "./Bıography/Biography";
import Education from "../Education/Education";
import { RootState } from "@/redux/store/store";

const AboutMe = () => {
  const language = useSelector((state: RootState) => state.language.language);

  return (
    <div className="card overflow-visible shadow-md compact bg-[#EBEBEB] min-w-100 rounded-sm mb-10 font-mono py-2 px-4">
      <h2 className="font-semibold text-lg ">
        {language ? "About Me" : "Hakkımda"}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 ">
        <div className="col-span-1 mb-8">
          <Biography />
        </div>
        <div className="col-span-1 mb-8">
          <Education />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
