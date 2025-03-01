"use client";
import Link from "next/link";
import DOMPurify from "dompurify";
import { getData } from "@/app/api/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  EmailShareButton,
  EmailIcon,
} from "next-share";

const ArticleDetail = () => {
  const { _id } = useParams();
  const pathname = usePathname();
  const fullUrl =
    typeof window !== "undefined" ? window.location.origin + pathname : "";
  const [idArticleData, setIdArticleData] = useState<any>(null);

  const fetchData = async () => {
    try {
      const data = await getData(`blogs/getById/${_id}`);
      setIdArticleData(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, [_id]);

  const Base64HtmlRenderer = ({ base64String }: any) => {
    const decodedHtml = Buffer.from(base64String, "base64").toString("utf-8");

    return (
      <div
        className="max-w-full text-gray-700 lg:[&_h1]:text-3xl [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:my-2 lg:[&_h2]:text-2xl [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-4  [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-2 lg:[&_p]:text-lg [&_p]:text-sm [&_p]:my-1 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-5 [&_li]:text-sm lg:[&_li]:text-base"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(decodedHtml) }}
      />
    );
  };

  return (
    <div className="max-w-full lg:max-w-[75%] mx-auto p-6 bg-white shadow-lg rounded-lg pb-15">
      <div className="max-w-full lg:max-w-[75%] mx-auto">
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
        <div className="flex justify-between">
          <div className="mt-8 font-semibold">
            {idArticleData?.createdAt.split("T")[0]}
          </div>
          <div className="mt-6">
            <WhatsappShareButton
              url={fullUrl}
              title={idArticleData?.title}
              separator=":: "
            >
              <WhatsappIcon size={32} round style={{ marginLeft: "10px" }} />
            </WhatsappShareButton>
            <LinkedinShareButton
              url={fullUrl}
              title={idArticleData?.title}
              summary={idArticleData?.title}
              source={fullUrl}
            >
              <LinkedinIcon size={32} round style={{ marginLeft: "10px" }} />
            </LinkedinShareButton>
            <TwitterShareButton url={fullUrl} title={idArticleData?.title}>
              <TwitterIcon size={32} round style={{ marginLeft: "10px" }} />
            </TwitterShareButton>
            <FacebookShareButton
              url={fullUrl}
              quote={idArticleData?.title}
              hashtag={"#furkanislek"}
            >
              <FacebookIcon size={32} round style={{ marginLeft: "10px" }} />
            </FacebookShareButton>
            <EmailShareButton
              url={fullUrl}
              subject={idArticleData?.title}
              body={idArticleData?.title}
            >
              <EmailIcon size={32} round />
            </EmailShareButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
