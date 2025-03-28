"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFilteredData } from "@/redux/store/article";
import { RootState, AppDispatch } from "@/redux/store/store";

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const articleData = useSelector(
    (state: RootState) => state.article.articleData
  );
  const language = useSelector((state: RootState) => state.language.language);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = articleData.filter((article: any) =>
      article.title.toLowerCase().includes(searchValue)
    );
    dispatch(setFilteredData(filteredData));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-5">
      <div className="col-span-1">
        <form className="flex max-w-sm min-w-full">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                />
              </svg>
            </div>
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  "
              placeholder={language ? "Search ..." : "Ara ..."}
              required
              onChange={handleSearchChange}
            />
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Navbar;
