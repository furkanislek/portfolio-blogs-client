"use client";
import React, { useEffect, useState } from "react";
import Articles from "../components/Blogs/Articles/Articles";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store/store";

const Blogs = () => {
  const language = useSelector((state: RootState) => state.language.language);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {language ? "Blog" : "Blog"}
            </h1>
            <p className="text-lg text-gray-600">
              {isClient && language
                ? "Technology, software and personal experiences"
                : "Teknoloji, yazılım ve kişisel deneyimlerim"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Blog Articles */}
      <Articles />
    </div>
  );
};

export default Blogs;
