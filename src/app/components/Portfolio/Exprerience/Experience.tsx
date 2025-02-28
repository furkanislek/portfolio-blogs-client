"use client";
import { getData } from "@/app/api/api";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store/store";
import { setExperienceData } from "@/redux/store/experience";
import LightsaberLoader from "../../LightsaberLoading/LightsaberLoader";

const Experience = () => {
  const dispatch = useDispatch<AppDispatch>();

  const fetchData = async () => {
    const response = await getData("experience");
    dispatch(setExperienceData(response));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = useSelector((state: RootState) => state.experience.experiences);
  const loading = useSelector((state: RootState) => state.experience.loading);

  return (
    <div className="card overflow-visible shadow-md compact bg-[#EBEBEB] min-w-100 rounded-sm mb-10 font-mono py-2 px-4 min-h-72">
      {loading ? (
        <div className="min-w-full min-h-72 mx-auto flex flex-col justify-center items-center align-middle self-center text-center">
          <LightsaberLoader />
        </div>
      ) : (
        <>
          <h2 className="font-semibold text-lg">Experience</h2>
          <main className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm mb-10 font-mono py-2 lg:pb-4 px-8 md:px-12 lg:px-16 h-full mt-4">
            {data.map((item, key) => (
              <div className="text-gray-700 mt-8" key={key}>
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold">{item.title}</h4>
                  <p className=" font-bold ">{item.company}</p>
                </div>
                <ul
                  className="ml-1 md:ml-2 lg:ml-4 mt-3 "
                  style={{ listStyle: "initial" }}
                >
                  {item.details.map((item, key) => (
                    <li
                      key={key}
                      className="ml-1 md:ml-2 lg:ml-4 mt-1 text-justify"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="ml-1 md:ml-2 lg:ml-4 text-red-800 font-bold mt-2">
                  {item.time}
                </p>
              </div>
            ))}
          </main>
        </>
      )}
    </div>
  );
};

export default Experience;
