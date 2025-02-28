"use client";
import { getData } from "@/app/api/api";
import React, { useEffect } from "react";
import Avatar from "../Portfolio/Avatar/Avatar";
import ChangePage from "../Portfolio/Menu/ChangePage";
import UserCard from "../Portfolio/UserCard/UserCard";
import { useSelector, useDispatch } from "react-redux";
import { setUserInformation } from "@/redux/store/user";
import TechStack from "../Portfolio/TechStack/TechStack";
import { AppDispatch, RootState } from "@/redux/store/store";

const HomeNavbar = () => {
  console.log("====================================");
  console.log("Test");
  console.log("====================================");
  const dispatch = useDispatch<AppDispatch>();

  const fetchData = async () => {
    const data = await getData("userInformation");
    dispatch(setUserInformation(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ChangePage />
      <Avatar />
      <UserCard />
      <TechStack />
    </>
  );
};

export default HomeNavbar;
