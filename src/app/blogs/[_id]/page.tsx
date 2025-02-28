"use client";
import Link from "next/link";
import DOMPurify from "dompurify";
import { getData } from "@/app/api/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ArticleDetail = () => {
  const { _id } = useParams(); 

  const [idArticleData, setIdArticleData] = useState<any>(null);
  
  const fetchData = async () => {
    try {
      const data = await getData(`blogs/getById/${_id}`);
      setIdArticleData(data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchData();
  }, [_id]);

  const Base64HtmlRenderer = ({ base64String }: any) => {
    const decodedHtml = Buffer.from(base64String, "base64").toString("utf-8");

    return (
      <div
        className="max-w-full text-gray-700 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:my-2 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:my-2  [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-2 [&_p]:text-lg [&_p]:my-1 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-5"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(decodedHtml) }}
      />
    );
  };

  return (
    <div className="max-w-[75%] mx-auto p-6 bg-white shadow-lg rounded-lg pb-15">
      <div className="max-w-[75%] mx-auto">
        <div className="flex justify-between">
          <Link href="/blogs">
            <p className="capitalize mb-4 text-2xl">🔙</p>
          </Link>
          <p className="capitalize mb-4 text-md">{idArticleData?.type}</p>
        </div>
        <img
          src={idArticleData?.img}
          alt={idArticleData?.title}
          className="w-full rounded-lg h-72 mb-4"
        />
        <h1 className="text-3xl text-center max-w-[100%] font-bold mb-8">
          {idArticleData?.title}
        </h1>
        <div className="text-gray-700 text-justify">
          {idArticleData && (
            <Base64HtmlRenderer base64String={idArticleData?.description} />
          )}
        </div>
        <div className="text-left mt-8 font-semibold">
          {idArticleData?.createdAt.split("T")[0]}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
