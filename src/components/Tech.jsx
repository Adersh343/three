import React, { useEffect, useState } from "react";
import { SectionWrapper } from "../hoc";
import { db } from "../../firebase"; // Import your Firebase configuration
import { collection, getDocs } from "firebase/firestore"; // Firebase Firestore functions

const Tech = () => {
  const [technologies, setTechnologies] = useState([]); // State to store technologies
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  // Fetch technologies from Firestore
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "byteedoctechnologies"));
        const fetchedTechnologies = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTechnologies(fetchedTechnologies); // Set the fetched technologies in state
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching technologies: ", error);
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchTechnologies(); // Call the function to fetch data
  }, []); // Empty dependency array to run this only once

  // Display loading message while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row flex-wrap justify-center gap-10">
      {technologies.map((technology) => (
        <div 
            className="w-28 h-28 flex flex-col items-center justify-center glass-panel p-4 hover:scale-110 transition-transform duration-300 cursor-pointer group" 
            key={technology.id}
        >
          <img
            src={technology.icon} 
            alt={technology.name} 
            className="w-16 h-16 object-contain filter drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.5)] transition-all" 
          />
          <div className="text-gray-300 text-sm font-medium mt-2 text-center group-hover:text-accent transition-colors">{technology.name}</div>
        </div>
      ))}
    </div>
  );
};

export default SectionWrapper(Tech, "");
