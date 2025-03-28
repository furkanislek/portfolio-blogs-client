"use client";
import { getData } from "@/app/api/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { setArticleData } from "@/redux/store/article";
import { useSelector, useDispatch } from "react-redux";
import { decryptData, encryptData } from "@/app/api/crypto";
import { RootState, AppDispatch } from "@/redux/store/store";
import LightsaberLoader from "../../LightsaberLoading/LightsaberLoader";

const Articles = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState<boolean>(true);

  const language = useSelector((state: RootState) => state.language.language);
  const articleData = useSelector(
    (state: RootState) => state.article.articleData
  );
  const filteredData = useSelector(
    (state: RootState) => state.article.filteredData
  );

  const data = filteredData ? filteredData : articleData;

  const fetchData = async () => {
    try {
      const cacheKey = "cache_blogs_1";
      const cacheTimestampKey = "cache_blogs_timestamp_1";

      if (articleData && articleData.length > 0) {
        return;
      }

      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(cacheTimestampKey);

      if (cachedData && cacheTimestamp) {
        const timeElapsed = Date.now() - parseInt(cacheTimestamp);
        const ttl = 3000;

        if (timeElapsed < ttl) {
          const decryptedData = decryptData(cachedData);
          if (decryptedData) {
            dispatch(setArticleData(decryptedData));
            return;
          }
        } else {
          localStorage.removeItem(cacheKey);
          localStorage.removeItem(cacheTimestamp);
        }
      }

      const response = await getData("blogs");
      dispatch(setArticleData(response));

      const encryptedData = encryptData(response);
      localStorage.setItem(cacheKey, encryptedData);
      localStorage.setItem(cacheTimestampKey, Date.now().toString());
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="card overflow-visible shadow-md compact bg-[#EBEBEB] min-w-100 min-h-content pb-10 rounded-sm mb-10 font-mono py-2 lg:px-4">
      {loading ? (
        <div className="min-w-full min-h-72 mx-auto flex flex-col justify-center items-center align-middle self-center text-center">
          <LightsaberLoader />
        </div>
      ) : (
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
                  {language ? item.title : item.trTitle}
                </button>
                <article className="mt-2 text-justify text-xs lg:text-sm line-clamp-4">
                  {language ? item.summary : item.trSummary}
                </article>
                <footer className="mt-2 mb-4 min-w-full flex justify-between">
                  <p>{item.createdAt.split("T")[0]}</p>
                  <p>{item.type}</p>
                </footer>
              </main>
            ))}
        </div>
      )}
    </div>
  );
};

export default Articles;
