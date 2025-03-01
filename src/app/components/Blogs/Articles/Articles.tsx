"use client";
import { getData } from "@/app/api/api";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setArticleData } from "@/redux/store/article";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store/store";

const Articles = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const fetchData = async () => {
    const data = await getData("blogs");
    dispatch(setArticleData(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const articleData = useSelector(
    (state: RootState) => state.article.articleData
  );
  
  const filteredData = useSelector(
    (state: RootState) => state.article.filteredData
  );

  const data = filteredData ? filteredData: articleData;
  
  return (
    <div className="card overflow-visible shadow-md compact bg-[#EBEBEB] min-w-100 min-h-content pb-10 rounded-sm mb-10 font-mono py-2 lg:px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data &&
          data.map((item: any) => (
            <main
              key={item._id}
              className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm mb-10 font-mono py-2 lg:pb-4 px-2 lg:px-8 flex flex-col justify-between align-center items-center h-full mt-4"
            >
              <img
                className="rounded-t-lg h-72 min-w-full  object-cover"
                src={item.img}
                alt={item.img}
              />
              <button
                onClick={() => router.push(`/blogs/${item._id}`)}
                className="align-center font-semibold mt-3"
              >
                {item.title}
              </button>
              <article className="mt-2 text-justify text-xs lg:text-sm line-clamp-4">
                {item.summary}
              </article>
              <footer className="mt-2 mb-4 min-w-full flex justify-between">
                <p>{item.createdAt.split("T")[0]}</p>
                <p>{item.type}</p>
              </footer>
            </main>
          ))}
      </div>
    </div>
  );
};

export default Articles;
