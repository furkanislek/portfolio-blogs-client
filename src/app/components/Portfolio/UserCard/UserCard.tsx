"use client";

import {
  Globe,
  Mail,
  Github,
  Linkedin,
  X,
  Code,
  MapPin,
  AtSign,
} from "lucide-react";
import Image from "next/image";
import { getData } from "@/app/api/api";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocialsData } from "@/redux/store/socials";
import { RootState, AppDispatch } from "@/redux/store/store";

export default function UserCard() {
  const dispatch = useDispatch<AppDispatch>();

  const fetchData = async () => {
    const response = await getData("socials");
    dispatch(setSocialsData(response));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = useSelector((state: RootState) => state.socials.socialsData);

  return (
    <div className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm mb-10  px-6 py-6 font-mono">
      <div className="font-semibold text-xl text-gray-600 mb-4 lg:mb-8">
        <h2>Social Accounts</h2>
      </div>
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
              <span className="text-gray-600 font-medium">{item.title}</span>
            </div>
            {item.href ? (
              <a
                href={item.href }
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                {item.address}
              </a>
            ) : (
              <p>{item.address}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
