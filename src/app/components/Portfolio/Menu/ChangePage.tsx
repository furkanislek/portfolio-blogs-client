"use client";
import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

const ChangePage = () => {
  const language = useSelector((state: RootState) => state.language.language);

  return (
    <div className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm font-mono mb-5 ">
      <div className="flex justify-between p-6">
        <Link className="rounded p-1 " href={"/"}>
          {language ? "Portfolio" : "Ana Sayfa"}
        </Link>
        <Link className="rounded p-1 " href={"/blogs"}>
          {language ? "Blogs" : "Blog"}
        </Link>
      </div>
    </div>
  );
};

export default ChangePage;
