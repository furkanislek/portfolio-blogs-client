import React from "react";
import Navbar from "../components/Blogs/Navbar/Navbar";
import Articles from "../components/Blogs/Articles/Articles";

const Blogs = () => {
  return (
    <div>
      <div className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm font-mono mb-10 shadow-[0px_0px_20px_5px_rgba(0,_0,_0,_0.2)]">
        <div className="min-w-[100%] ">
          <Navbar />
        </div>
      </div>
      <Articles />
    </div>
  );
};

export default Blogs;
