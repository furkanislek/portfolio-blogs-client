"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import LightsaberLoader from "@/app/components/LightsaberLoading/LightsaberLoader";

const Biography = () => {
  const userData = useSelector(
    (state: RootState) => state.user.userInformation
  );
  const loading = useSelector((state: RootState) => state.experience.loading);

  return (
    <>
      <main className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm mb-10 font-mono py-2 px-4 h-full min-h-72">
        {loading ? (
          <div className="min-w-full min-h-72 mx-auto flex flex-col justify-center items-center align-middle self-center text-center">
            <LightsaberLoader />
          </div>
        ) : (
          <article>
            <h5 className="py-4 lg:py-8 px-6 lg:px-8 text-justify text-xs lg:text-sm text-gray-700">
              {userData && userData[0].description}
            </h5>
            <h4 className="py-4 px-6 lg:px-8 text-justify text-xs lg:text-sm">
              Software Developer
            </h4>
          </article>
        )}
      </main>
    </>
  );
};

export default Biography;
