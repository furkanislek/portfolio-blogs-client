"use client";
import { getData } from "@/app/api/api";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectData } from "@/redux/store/projects";
import { RootState, AppDispatch } from "@/redux/store/store";

const Projects = () => {
  const dispatch = useDispatch<AppDispatch>();

  const fetchData = async () => {
    const response = await getData("projects");
    dispatch(setProjectData(response));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = useSelector((state: RootState) => state.project.projectsData);

  return (
    <div className="card overflow-visible shadow-md compact bg-[#EBEBEB] min-w-100 rounded-sm mb-10 font-mono py-2 px-4">
      Projects
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.map((item, key) => (
          <main
            key={key}
            className="card overflow-visible shadow-md compact bg-white min-w-100 rounded-sm mb-10 font-mono py-2 lg:pb-4 px-8 flex flex-col justify-center align-center items-center h-full mt-4"
          >
            <h5 className="align-center">{item.title}</h5>
            <a href={item.href} className="cursor-pointer mt-2" target="_blank">
              <img
                className="rounded-t-lg max-h-72 minw-full object-cover"
                src={item.imgSrc}
                alt=""
              />
            </a>
            <article className="mt-2 mb-4 lg:mt-12 text-justify px-2 lg:px-8">
              {item.description}
            </article>
            <div className="flex min-w-[100%] px-8 mt-2 flex-wrap flew-row justify-between">
              <a
                href={item.href}
                className="cursor-pointer mt-2"
                target="_blank"
              >
                <button
                  type="button"
                  className="rounded-sm compact bg-[#7CC6FE] text-white px-6 py-2"
                >
                  Source code
                </button>
              </a>
              <a
                href={item.liveHref}
                className="cursor-pointer mt-2"
                target="_blank"
              >
                <button
                  type="button"
                  className="rounded-sm compact bg-[#D8A85A] text-white px-6 py-2"
                >
                  Live Demo
                </button>
              </a>
            </div>
          </main>
        ))}
      </div>
    </div>
  );
};

export default Projects;
