"use client";
import { getData } from "@/app/api/api";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTechStackData } from "@/redux/store/techStack";
import { RootState, AppDispatch } from "@/redux/store/store";
import LightsaberLoader from "../../LightsaberLoading/LightsaberLoader";

const TechStack = () => {
  const dispatch = useDispatch<AppDispatch>();

  const fetchData = async () => {
    const response = await getData("techStack");
    dispatch(setTechStackData(response));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = useSelector((state: RootState) => state.techStack.techStackData);
  const loading = useSelector((state: RootState) => state.experience.loading);

  return (
    <div className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm mb-10 font-mono py-2 px-4 min-h-36">
      <div className="flex flex-col">
        <div className="font-semibold text-xl text-gray-600 my-2">
          <h2>Tech Stack</h2>
        </div>
        {loading ? (
          <div className="min-w-full min-h-72 mx-auto flex flex-col justify-center items-center align-middle self-center text-center">
            <LightsaberLoader />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center align-center m-2">
            {data.map((item, key) => (
              <p
                key={key}
                className="m-1 hover:cursor-pointer hover:bg-opacity-0.2 rounded-xl bg-gray-200 py-1 px-3 text-xs"
              >
                {item.name}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechStack;
