"use client";
import React from 'react'
import Link from "next/link";

const ChangePage = () => {
  return (
    <div className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm font-mono mb-10 ">
      <div className="flex justify-between p-6">
        <Link
          className='rounded p-1 '
          href={"/"}
        >
          Portfolio
        </Link>
        <Link
          className='rounded p-1 '
          href={"/blogs"}
        >
          Blogs
        </Link>
      </div>
    </div>
  );
}

export default ChangePage