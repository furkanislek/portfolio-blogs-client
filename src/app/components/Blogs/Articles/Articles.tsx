"use client";
import { getData } from "@/app/api/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { setArticleData } from "@/app/redux/store/article";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store/store";
import { Calendar, Tag, ArrowRight } from "lucide-react";

const Articles = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState<boolean>(true);
  const [isClient, setIsClient] = useState(false);

  const language = useSelector((state: RootState) => state.language.language);
  const articleData = useSelector(
    (state: RootState) => state.article.articleData
  );
  const filteredData = useSelector(
    (state: RootState) => state.article.filteredData
  );

  const data = filteredData ? filteredData : articleData;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchData = async () => {
    try {
      const response = await getData("blogs");
      dispatch(setArticleData(response));
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data &&
          data.map((item: any) => (
            <article
              key={item._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
              onClick={() => router.push(`/blogs/${item._id}`)}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  src={item.img}
                  alt={language ? item.title : item.trTitle}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {item.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {language ? item.title : item.trTitle}
                </h2>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {language ? item.summary : item.trSummary}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {isClient ? new Date(item.createdAt).toLocaleDateString('tr-TR') : item.createdAt.split("T")[0]}
                    </span>
                  </div>
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                    <span className="mr-1">{isClient && language ? "Read More" : "Devamını Oku"}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </article>
          ))}
      </div>

      {data && data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isClient && language ? "No blog posts yet" : "Henüz blog yazısı yok"}
          </h3>
          <p className="text-gray-500">
            {isClient && language ? "New content will be added soon." : "Yakında yeni içerikler eklenecek."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Articles;
