import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { db } from '../../firebase'; // Assuming you're using Firebase for dynamic data
import { doc, getDoc } from 'firebase/firestore';
import imagePath from "../assets/comp.svg";

const Hero = () => {
  const [heroData, setHeroData] = useState({
    heading: "",
    subheading: "",
    imageUrl: "",
    cvUrl: "", // Add CV URL for download
  });

  useEffect(() => {
    // Function to fetch hero data from Firebase
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, "heroSection", "1"); // Assuming you have a document in Firestore with ID "1"
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHeroData(docSnap.data());
        } else {
          console.log("No such document!");
        }

        // Fetch CV URL from Firestore (assuming it is saved in a separate "cvSection" document)
        const cvDocRef = doc(db, "cvSection", "1"); // Adjust according to your Firestore structure
        const cvDocSnap = await getDoc(cvDocRef);
        if (cvDocSnap.exists()) {
          setHeroData(prevData => ({
            ...prevData,
            cvUrl: cvDocSnap.data().cvUrl,
          }));
        }

      } catch (error) {
        console.error("Error fetching hero data: ", error);
      }
    };

    fetchHeroData();
  }, []);

  // Function to handle CV download
  const handleDownloadCv = () => {
    if (heroData.cvUrl) {
      const link = document.createElement('a');
      link.href = heroData.cvUrl;  // Use the CV URL from Firestore
      link.download = 'CV.pdf';  // You can dynamically set the name of the file
      link.click();
    } else {
      alert("CV is not available.");
    }
  };

  return (
    <section className="relative w-full h-screen mx-auto">
      <div className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-col items-start gap-5`}>
        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            {heroData.heading || "Hi, Byteedoc"} <span className="text-secondary2">{heroData.subheading ? heroData.subheading : "Coding Family"}</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            {heroData.subheading || "we are here for"} <br className="sm:block hidden" />
            {heroData.subheading ? heroData.subheading : "interfaces and web applications"}
          </p>
        </div>

        {/* Image positioned below the heading and description */}
        <div className="w-full flex justify-center">
          <img
            src={heroData.imageUrl || imagePath} // Fallback to default if no image URL
            alt="Hero Image"
            className="object-contain max-w-full h-auto"
          />
        </div>
      </div>

      {/* Scroll down arrow */}
      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>

      {/* Fixed Vertical Download Button */}
      {heroData.cvUrl && (
        <div className="absolute right-8  bottom-0  transform -translate-y-1/2 bg-secondary text-white py-3 px-6 rounded-full cursor-pointer shadow-lg hover:bg-primary/20 transition duration-300 z-10">
          <button onClick={handleDownloadCv} className="flex items-center justify-center">
            <span className="text-lg font-semibold">Download CV</span>
          </button>
        </div>
      )}
    </section>
  );
};

export default Hero;
