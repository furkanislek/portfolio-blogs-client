import React from "react";
import AboutMe from "../Portfolio/AboutMe/AboutMe";
import Avatar from "../Portfolio/Avatar/Avatar";
import Experience from "../Portfolio/Exprerience/Experience";
import ChangePage from "../Portfolio/Menu/ChangePage";
import Projects from "../Portfolio/Projects/Projects";
import TechStack from "../Portfolio/TechStack/TechStack";
import UserCard from "../Portfolio/UserCard/UserCard";

const HomePage = () => {
  return (
    <>
      <AboutMe />
      <Experience />
      <Projects />
    </>
  );
};

export default HomePage;
