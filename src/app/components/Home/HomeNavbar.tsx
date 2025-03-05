"use client";
import { getData } from "@/app/api/api";
import React, { useEffect } from "react";
import Avatar from "../Portfolio/Avatar/Avatar";
import ChangePage from "../Portfolio/Menu/ChangePage";
import UserCard from "../Portfolio/UserCard/UserCard";
import { setLoading } from "@/redux/store/experience";
import { useDispatch, useSelector } from "react-redux";
import { setUserInformation } from "@/redux/store/user";
import TechStack from "../Portfolio/TechStack/TechStack";
import { decryptData, encryptData } from "@/app/api/crypto";
import { AppDispatch, RootState } from "@/redux/store/store";

const HomeNavbar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const homeData = useSelector(
    (state: RootState) => state.user.userInformation
  );

  const fetchData = async () => {
    const cacheKey = "cache_userInformation";

    if (homeData && homeData.length > 0) {
      dispatch(setLoading(false));
      return;
    }

    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const decryptedData = decryptData(cachedData);
      if (decryptedData) {
        dispatch(setLoading(false));
        dispatch(setUserInformation(decryptedData));
        return;
      }
    }

    const response = await getData("userInformation");
    dispatch(setUserInformation(response));
    const encryptedData = encryptData(response);
    localStorage.setItem(cacheKey, encryptedData);
    response && dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="text-xs lg:text-base">
      <ChangePage />
      <Avatar />
      <UserCard />
      <TechStack />
    </div>
  );
};

export default HomeNavbar;
