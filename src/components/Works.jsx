// Works.js
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({ name, description, tags, imageUrl, githubLink, liveDemoLink }) => {
  return (
    <motion.div variants={fadeIn("up", "spring", 0, 0.75)}>
      <motion.div
        whileHover={{
          scale: 1.05,
          rotate: 2,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
        className="bg-tertiary p-5 rounded-2xl w-full"
      >
        <div className="relative w-full">
          <img
            src={imageUrl}
            alt="project_image"
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
            <div
              onClick={() => window.open(githubLink, "_blank")}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              <img
                src={github}
                alt="source code"
                className="w-1/2 h-1/2 object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{name}</h3>
          <p className="mt-2 text-secondary text-[14px]">{description}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <p key={`${name}-${index}`} className="text-[14px] text-white">
              #{tag}
            </p>
          ))}
        </div>
        <div className="mt-4 flex justify-between">
          <a
            href={liveDemoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            Live Demo
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Works = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, "projects");
      const snapshot = await getDocs(projectsCollection);
      const projectList = snapshot.docs.map((doc) => doc.data());
      setProjects(projectList);
    };
    
    fetchProjects();
  }, []);

  return (
    <div>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>My work</p>
        <h2 className={styles.sectionHeadText}>Projects.</h2>
      </motion.div>

      <div className="mt-20 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Works, "works");
