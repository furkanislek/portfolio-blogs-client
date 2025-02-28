"use client"
import React from 'react'
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

const Biography = () => {
  const userData = useSelector(
    (state: RootState) => state.user.userInformation
  );

  return (
    <main className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm mb-10 font-mono py-2 px-4 h-full">
      <article>
        <h5 className="py-4 lg:py-8 px-6 lg:px-8 text-justify text-gray-700">
          {userData && userData[0].description}
        </h5>
        <h4 className="py-4 px-6 lg:px-8 text-justify">Software Developer</h4>
      </article>
    </main>
  );
}

export default Biography