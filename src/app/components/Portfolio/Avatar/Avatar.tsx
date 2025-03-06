import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import React, { useEffect, useState } from "react";
import LightsaberLoader from "../../LightsaberLoading/LightsaberLoader";

const Avatar = () => {
  const userData = useSelector(
    (state: RootState) => state.user.userInformation
  );
  const language = useSelector((state: RootState) => state.language.language);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    userData && setImageUrl(userData[0].avatar);
  }, [userData]);
  const loading = useSelector((state: RootState) => state.experience.loading);

  return (
    <div className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm py-6 mb-10">
      <div className="flex flex-col justify-center items-center p-6 min-w-full">
        {loading ? (
          <div className="min-w-full min-h-72 mx-auto flex flex-col justify-center items-center align-middle self-center text-center">
            <LightsaberLoader />
          </div>
        ) : (
          <img
            src={imageUrl || undefined}
            alt="avatar"
            className="rounded-full ring-4 ring-gray-400 size-[120px] mb-5"
          />
        )}
        <p className="font-semibold font-roboto text-2xl text-gray-600 mb-8">
          Furkan Akif ISLEK
        </p>
        <p className="font-mono text-sm text-gray-600 mb-8">
          {userData?.[0]?.mainTitle || ""}
        </p>
        <div>
          <a
            href="./cv.pdf"
            download
            className="rounded-xl text-gray-600 border-2 border-solid px-6 py-1 text-sm font-mono"
          >
            {language ? "Download Resume" : "CV Indir"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
