import React, { useState, useEffect } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import { db } from "../../firebase"; // Import firebase configuration
import { collection, getDocs } from "firebase/firestore"; // Firestore methods

import "react-vertical-timeline-component/style.min.css";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "rgba(255, 255, 255, 0.05)",
        color: "#fff",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "15px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)"
      }}
      contentArrowStyle={{ borderRight: "7px solid  rgba(255, 255, 255, 0.05)" }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg, boxShadow: "0 0 20px rgba(112, 66, 248, 0.5)" }}
      icon={
        <div className='flex justify-center items-center w-full h-full'>
          <img
            src={experience.image}
            alt={experience.company_name}
            className='w-[70%] h-[70%] object-contain'
          />
        </div>
      }
    >
      <div>
        <h3 className='text-white text-[24px] font-bold'>{experience.title}</h3>
        <p
          className='text-secondary text-[16px] font-semibold'
          style={{ margin: 0 }}
        >
          {experience.company_name}
        </p>
      </div>

      <ul className='mt-5 list-disc ml-5 space-y-2'>
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className='text-white-100 text-[14px] pl-1 tracking-wider'
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "byteedocexperiences"));
        const experiencesData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setExperiences(experiencesData);
      } catch (error) {
        console.error("Error fetching experiences: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          What I have done so far
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          Work Experience.
        </h2>
      </motion.div>

      {loading ? (
        <div className="text-center text-white">Loading...</div>
      ) : (
        <div className='mt-20 flex flex-col'>
          <VerticalTimeline>
            {experiences.map((experience) => (
              <ExperienceCard
                key={`experience-${experience.id}`}
                experience={experience}
              />
            ))}
          </VerticalTimeline>
        </div>
      )}
    </>
  );
};

export default SectionWrapper(Experience, "work");
