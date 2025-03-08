"use client";

import { getData } from "@/app/api/api";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocialsData } from "@/redux/store/socials";
import { decryptData, encryptData } from "@/app/api/crypto";
import { RootState, AppDispatch } from "@/redux/store/store";
import LightsaberLoader from "../../LightsaberLoading/LightsaberLoader";

export default function UserCard() {
  const dispatch = useDispatch<AppDispatch>();

  const data = useSelector((state: RootState) => state.socials.socialsData);
  const loading = useSelector((state: RootState) => state.experience.loading);
  const language = useSelector((state: RootState) => state.language.language);

  const fetchData = async () => {
    const cacheKey = "cache_socials_1";

    if (data && data.length > 0) {
      return;
    }

    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const decryptedData = decryptData(cachedData);
      if (decryptedData) {
        dispatch(setSocialsData(decryptedData));
        return;
      }
    }

    const response = await getData("socials");
    dispatch(setSocialsData(response));

    const encryptedData = encryptData(response);
    localStorage.setItem(cacheKey, encryptedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm mb-10  px-6 py-6 font-mono">
      <div className="font-semibold text-xl text-gray-600 mb-4 lg:mb-8">
        <h2>{language ? "Social Accounts" : "Bilgilerim"}</h2>
      </div>
      {loading ? (
        <div className="min-w-full min-h-72 mx-auto flex flex-col justify-center items-center align-middle self-center text-center">
          <LightsaberLoader />
        </div>
      ) : (
        <ul className="space-y-8">
          {data.map((item, key) => (
            <li className="flex justify-between items-center" key={key}>
              <div className="flex items-center">
                <img
                  src={item.img}
                  style={{ color: "black" }}
                  className="mr-2"
                  alt=""
                  width={24}
                  height={24}
                />
                <span className="text-gray-600 font-medium">
                  {item.title == "Based in"
                    ? language
                      ? "Konum"
                      : "Based in"
                    : item.title}
                </span>
              </div>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  {item.address}
                </a>
              ) : (
                <p>
                  {" "}
                  {item.address == "Turkey"
                    ? !language
                      ? "Türkiye"
                      : "Turkey"
                    : item.address}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
