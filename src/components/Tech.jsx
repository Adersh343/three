import React from "react";

import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  return (
    <div className='flex flex-row flex-wrap justify-center gap-10'>
      {technologies.map((technology) => (
        <div className='w-28 h-28 flex flex-col items-center' key={technology.name}>
          <img
            src={technology.icon}  // Use the icon for each technology
            alt={technology.name}   // Alt text based on the technology's name
            className="w-full h-full object-contain" // Ensures image fits well
          />
          <div className="text-white text-center mt-2">{technology.name}</div> {/* Display the technology's name */}
        </div>
      ))}
    </div>
  );
};

export default SectionWrapper(Tech, "");
