"use client";
import { getData } from "@/app/api/api";
import React, { useEffect } from "react";
import Avatar from "../Portfolio/Avatar/Avatar";
import ChangePage from "../Portfolio/Menu/ChangePage";
import UserCard from "../Portfolio/UserCard/UserCard";
import { setLoading } from "@/app/redux/store/experience";
import { useDispatch, useSelector } from "react-redux";
import { setUserInformation } from "@/app/redux/store/user";
import TechStack from "../Portfolio/TechStack/TechStack";
import LanguagePage from "../Portfolio/Language/Language";
import { AppDispatch, RootState } from "@/app/redux/store/store";

const HomeNavbar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const homeData = useSelector(
    (state: RootState) => state.user.userInformation
  );

  const fetchData = async () => {
    const response = await getData("userInformation");
    dispatch(setUserInformation(response));
    response && dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="text-xs lg:text-base">
      <ChangePage />
      <LanguagePage />
      <Avatar />
      <UserCard />
      <TechStack />
    </div>
  );
};

export default HomeNavbar;
