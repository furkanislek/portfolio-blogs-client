import React from 'react'
import Education from '../Education/Education'
import Biography from './Bıography/Biography';

const AboutMe = () => {
  return (
    <div className="card overflow-visible shadow-md compact bg-[#EBEBEB] min-w-100 rounded-sm mb-10 font-mono py-2 px-4">
      <h2 className="font-semibold text-lg ">About Me</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 ">
        <div className="col-span-1 mb-8">
          <Biography />
        </div>
        <div className="col-span-1 mb-8">
          <Education />
        </div>
      </div>
    </div>
  );
}

export default AboutMe