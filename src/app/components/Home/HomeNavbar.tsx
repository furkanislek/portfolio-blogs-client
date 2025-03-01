"use client";
import { getData } from "@/app/api/api";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Avatar from "../Portfolio/Avatar/Avatar";
import { AppDispatch } from "@/redux/store/store";
import ChangePage from "../Portfolio/Menu/ChangePage";
import UserCard from "../Portfolio/UserCard/UserCard";
import { setLoading } from "@/redux/store/experience";
import { setUserInformation } from "@/redux/store/user";
import TechStack from "../Portfolio/TechStack/TechStack";

const HomeNavbar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const fetchData = async () => {
    const data = await getData("userInformation");
    dispatch(setUserInformation(data));
    data && dispatch(setLoading(false));
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
