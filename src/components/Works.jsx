import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { motion } from "framer-motion"; // Import motion for animations

// ProjectCard with animation
const ProjectCard = ({ name, description, tags, imageUrl, githubLink, liveDemoLink }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Start with opacity 0 and slightly below
      whileInView={{ opacity: 1, y: 0 }}   // Animate when in view
      transition={{ duration: 0.6 }}    // Duration of the animation
      viewport={{ once: true }}         // Trigger only once when the element comes into view
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
  );
};

const Works = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // default to 'all'

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, "projects");
      const snapshot = await getDocs(projectsCollection);
      const projectList = snapshot.docs.map((doc) => doc.data());
      setProjects(projectList);
      setFilteredProjects(projectList); // Set filtered projects initially to all projects
    };

    fetchProjects();
  }, []);

  // Filter projects based on the active tab
  const filterProjects = (tab) => {
    setActiveTab(tab);

    let filtered = [];
    if (tab === "web") {
      filtered = projects.filter((project) =>
        project.name.toLowerCase().includes("web")
      );
    } else if (tab === "mobile") {
      filtered = projects.filter((project) =>
        project.name.toLowerCase().includes("mobile")
      );
    } else if (tab === "other") {
      filtered = projects.filter((project) =>
        !project.name.toLowerCase().includes("web") &&
        !project.name.toLowerCase().includes("mobile")
      );
    } else {
      // If 'all' tab is active, show all projects
      filtered = projects;
    }
    setFilteredProjects(filtered);
  };

  return (
    <div>
      <div>
        <p className={styles.sectionSubText}>My work</p>
        <h2 className={styles.sectionHeadText}>Projects.</h2>
      </div>

      {/* Tabs for filtering */}
      <div className="flex gap-6 mb-2 mt-2">
        <button
          className={`${
            activeTab === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          } py-2 px-4 rounded-full`}
          onClick={() => filterProjects("all")}
        >
          All
        </button>
        <button
          className={`${
            activeTab === "web" ? "bg-blue-500 text-white" : "bg-gray-200"
          } py-2 px-4 rounded-full`}
          onClick={() => filterProjects("web")}
        >
          Web Apps
        </button>
        <button
          className={`${
            activeTab === "mobile" ? "bg-blue-500 text-white" : "bg-gray-200"
          } py-2 px-4 rounded-full`}
          onClick={() => filterProjects("mobile")}
        >
          Mobile Apps
        </button>
        <button
          className={`${
            activeTab === "other" ? "bg-blue-500 text-white" : "bg-gray-200"
          } py-2 px-4 rounded-full`}
          onClick={() => filterProjects("other")}
        >
          Others
        </button>
      </div>

      {/* Projects Grid */}
      <div className="mt-20 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2 }} 
            viewport={{ once: true }}    
          >
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Works, "works");
