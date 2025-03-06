"use client";
import { getData } from "@/app/api/api";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decryptData, encryptData } from "@/app/api/crypto";
import { RootState, AppDispatch } from "@/redux/store/store";
import { setExperienceData } from "@/redux/store/experience";
import LightsaberLoader from "../../LightsaberLoading/LightsaberLoader";

const Experience = () => {
  const dispatch = useDispatch<AppDispatch>();

  const language = useSelector((state: RootState) => state.language.language);
  const loading = useSelector((state: RootState) => state.experience.loading);
  const data = useSelector((state: RootState) => state.experience.experiences);

  const fetchData = async () => {
    const cacheKey = "cache_experience";

    if (data && data.length > 0) {
      return;
    }

    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const decryptedData = decryptData(cachedData);
      if (decryptedData) {
        dispatch(setExperienceData(decryptedData));
        return;
      }
    }

    const response = await getData("experience");
    dispatch(setExperienceData(response));

    const encryptedData = encryptData(response);
    localStorage.setItem(cacheKey, encryptedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="card overflow-visible shadow-md compact bg-[#EBEBEB] min-w-100 rounded-sm mb-10 font-mono py-2 px-4 min-h-72">
      {loading ? (
        <div className="min-w-full min-h-72 mx-auto flex flex-col justify-center items-center align-middle self-center text-center">
          <LightsaberLoader />
        </div>
      ) : (
        <>
          <h2 className="font-semibold text-lg">
            {language ? "Experience" : "Deneyim"}
          </h2>
          <main className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm mb-10 font-mono py-2 lg:pb-4 px-8 md:px-12 lg:px-16 h-full mt-4">
            {data.map((item, key) => (
              <div className="text-gray-700 mt-8" key={key}>
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold ">
                    {language ? item.title : item.trTitle}
                  </h4>
                  <p className=" font-bold ">
                    {language ? item.company : item.trCompany}
                  </p>
                </div>
                <ul
                  className="ml-1 md:ml-2 lg:ml-4 mt-3 "
                  style={{ listStyle: "initial" }}
                >
                  {(language ? item.details : item.trDetails).map(
                    (detail, key) => (
                      <li
                        key={key}
                        className="ml-1 md:ml-2 lg:ml-4 text-justify text-xs lg:text-sm mt-4"
                      >
                        {detail}
                      </li>
                    )
                  )}
                </ul>
                <p className="ml-1 md:ml-2 lg:ml-4 text-red-800 font-bold mt-2">
                  {language ? item.time : item.trTime}
                </p>
                <hr className="mt-4" />
              </div>
            ))}
          </main>
        </>
      )}
    </div>
  );
};

export default Experience;
