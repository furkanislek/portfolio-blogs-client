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
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store/store";
import { ArrowLeft, Calendar, User, Share2, Clock } from "lucide-react";

const ArticleDetail = () => {
  const { _id } = useParams();
  const pathname = usePathname();
  const [idArticleData, setIdArticleData] = useState<any>(null);
  const [fullUrl, setFullUrl] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  const language = useSelector((state: RootState) => state.language.language);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setFullUrl(window.location.origin + pathname);
    }
  }, [pathname]);

  const fetchData = async () => {
    const response = await getData(`blogs/getById/${_id}`);
    setIdArticleData(response);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [_id]);

  const HtmlRenderer = ({ htmlContent }: { htmlContent: string }) => {
    if (!isClient) {
      return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>;
    }

    // Base64 decode function
    const decodeBase64 = (base64String: string) => {
      if (!base64String) return '';

      try {
        // Try to decode as base64 first
        const decoded = Buffer.from(base64String, 'base64').toString('utf-8');
        return decoded;
      } catch (error) {
        // If not base64, return as is
        return base64String;
      }
    };

    const decodedContent = decodeBase64(htmlContent);

    return (
      <div
        className="prose prose-lg max-w-none text-gray-700
          [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:text-gray-900
          [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-gray-900
          [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-gray-900
          [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mb-2 [&_h4]:mt-4 [&_h4]:text-gray-900
          [&_p]:text-lg [&_p]:mb-6 [&_p]:leading-relaxed [&_p]:text-gray-700
          [&_ul]:list-disc [&_ul]:ml-8 [&_ul]:mb-6 [&_ul]:space-y-2
          [&_ol]:list-decimal [&_ol]:ml-8 [&_ol]:mb-6 [&_ol]:space-y-2
          [&_li]:text-lg [&_li]:leading-relaxed
          [&_pre]:bg-gray-100 [&_pre]:p-6 [&_pre]:rounded-xl [&_pre]:overflow-auto [&_pre]:mb-6 [&_pre]:border [&_pre]:border-gray-200
          [&_code]:bg-gray-100 [&_code]:px-3 [&_code]:py-1 [&_code]:rounded-md [&_code]:text-sm [&_code]:font-mono
          [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:mb-6 [&_blockquote]:text-gray-600 [&_blockquote]:bg-blue-50 [&_blockquote]:py-4 [&_blockquote]:rounded-r-lg
          [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:mb-8 [&_img]:mt-8 [&_img]:shadow-lg [&_img]:mx-auto [&_img]:block
          [&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:underline [&_a]:font-medium
          [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-gray-300 [&_table]:mb-6 [&_table]:rounded-lg [&_table]:overflow-hidden
          [&_th]:border [&_th]:border-gray-300 [&_th]:px-6 [&_th]:py-3 [&_th]:bg-gray-50 [&_th]:font-semibold [&_th]:text-left
          [&_td]:border [&_td]:border-gray-300 [&_td]:px-6 [&_td]:py-3 [&_td]:text-gray-700"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(decodedContent)
        }}
      />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/blogs"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">{isClient && language ? "Back to Blog" : "Blog'a Dön"}</span>
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span>{idArticleData?.type}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {language ? idArticleData?.title : idArticleData?.trTitle}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>
                  {isClient
                    ? new Date(idArticleData?.createdAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                    : idArticleData?.createdAt.split("T")[0]
                  }
                </span>
              </div>
              {idArticleData?.author && (
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <span>{idArticleData.author}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{isClient && language ? "5 min read" : "5 dk okuma"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="max-w-3xl mx-auto">
            {idArticleData && (
              <HtmlRenderer
                htmlContent={
                  language
                    ? idArticleData?.description || ''
                    : idArticleData?.trDescription || ''
                }
              />
            )}
          </div>
        </article>

        {/* Share Section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center mb-6">
              <Share2 className="h-6 w-6 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                {isClient && language ? "Share this article" : "Bu yazıyı paylaş"}
              </h3>
            </div>

            {isClient && fullUrl && (
              <div className="flex justify-center space-x-4">
                <WhatsappShareButton
                  url={fullUrl}
                  title={language ? idArticleData?.title : idArticleData?.trTitle}
                  separator=":: "
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                    <WhatsappIcon size={24} />
                  </div>
                </WhatsappShareButton>

                <LinkedinShareButton
                  url={fullUrl}
                  title={language ? idArticleData?.title : idArticleData?.trTitle}
                  summary={language ? idArticleData?.summary : idArticleData?.trSummary}
                  source={fullUrl}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <LinkedinIcon size={24} />
                  </div>
                </LinkedinShareButton>

                <TwitterShareButton
                  url={fullUrl}
                  title={language ? idArticleData?.title : idArticleData?.trTitle}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
                    <TwitterIcon size={24} />
                  </div>
                </TwitterShareButton>

                <FacebookShareButton
                  url={fullUrl}
                  quote={language ? idArticleData?.title : idArticleData?.trTitle}
                  hashtag={"#furkanislek"}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-colors">
                    <FacebookIcon size={24} />
                  </div>
                </FacebookShareButton>

                <EmailShareButton
                  url={fullUrl}
                  subject={language ? idArticleData?.title : idArticleData?.trTitle}
                  body={language ? idArticleData?.summary : idArticleData?.trSummary}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors">
                    <EmailIcon size={24} />
                  </div>
                </EmailShareButton>
              </div>
            )}
          </div>
        </div>

        {/* Back to Blogs */}
        <div className="mt-12 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {isClient && language ? "View Other Articles" : "Diğer Yazıları Gör"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
