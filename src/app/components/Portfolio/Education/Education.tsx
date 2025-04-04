"use client";
import React, { useEffect } from "react";
import { getData } from "@/app/api/api";
import { useDispatch, useSelector } from "react-redux";
import { decryptData, encryptData } from "@/app/api/crypto";
import { setEducationData } from "@/redux/store/education";
import { RootState, AppDispatch } from "@/redux/store/store";
import LightsaberLoader from "../../LightsaberLoading/LightsaberLoader";
const Education = () => {
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector((state: RootState) => state.experience.loading);
  const language = useSelector((state: RootState) => state.language.language);
  
  const data = useSelector(
    (state: RootState) => state.education.educationsData
  );

  const fetchData = async () => {
    const cacheKey = "cache_education_1";

    if (data && data.length > 0) {
      return;
    }

    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const decryptedData = decryptData(cachedData);
      if (decryptedData) {
        dispatch(setEducationData(decryptedData));
        return;
      }
    }

    const response = await getData("education");
    dispatch(setEducationData(response));
    const encryptedData = encryptData(response);
    localStorage.setItem(cacheKey, encryptedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm mb-10 font-mono py-2 px-8 h-full min-h-72">
      {loading ? (
        <div className="min-w-full min-h-72 mx-auto flex flex-col justify-center items-center align-middle self-center text-center">
          <LightsaberLoader />
        </div>
      ) : (
        <ul style={{ listStyle: "initial" }}>
          {data.map((item, key) => (
            <li className="mt-2 text-justify text-gray-700" key={key}>
              <div>
                <h4 className="font-bold text-gray-700">
                  {language ? item.title : item.trTitle}
                </h4>
                <p className="mt-1 ml-3 text-red-800 font-bold">{item.time}</p>
                <p className="mt-1 ml-3 text-xs lg:text-sm">
                  {language ? item.description : item.trDescription}
                </p>
                <p className="mt-1 ml-3 italic">
                  {language ? item.company : item.trCompany}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Education;
