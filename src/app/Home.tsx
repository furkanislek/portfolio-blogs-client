"use client";
import React from "react";
import HomeNavbar from "./components/Home/HomeNavbar";

const Home = ({ children }: any) => {
  return (
    <>
      <div className="flex-1 overflow-auto relative z-10 bg-gray-100 min-h-screen">
        <main className="max-w-85 mx-auto py-6 px-12 lg:px-12 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-1 gap-y-4 sticky:0">
              <HomeNavbar />
            </div>
            <div className="col-span-1 lg:col-span-3 gap-y-4">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
