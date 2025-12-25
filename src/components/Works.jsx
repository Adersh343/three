import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { motion } from "framer-motion";


const ProjectCard = ({
  name,
  description,
  tags,
  imageUrl,
  githubLink,
  liveDemoLink,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to toggle modal
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="glass-panel p-5 rounded-2xl w-full cursor-pointer hover:-translate-y-2 transition-transform duration-300 border border-white/5 hover:border-accent/50 group" 
        onClick={toggleModal}
      >
        <div className='relative w-full h-[230px] rounded-2xl overflow-hidden'>
             <img
              src={imageUrl} 
              alt={name}
              className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' 
            />
          <div className='absolute inset-0 flex justify-end m-3 card-img_hover gap-2'>
            <div
              onClick={(e) => {
                e.stopPropagation();
                window.open(githubLink, "_blank");
              }}
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition-transform border border-white/20'
            >
              <img
                src={github}
                alt='source code'
                className='w-1/2 h-1/2 object-contain'
              />
            </div>
             <div
              onClick={(e) => {
                e.stopPropagation();
                window.open(liveDemoLink, "_blank");
              }}
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition-transform border border-white/20'
            >
               {/* Replace with a link icon if available, ensuring accessibility */}
               <span className="text-[10px] text-white font-bold">LIVE</span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px] truncate group-hover:text-accent transition-colors">{name}</h3>
          <p className="mt-2 text-text-secondary text-[14px] line-clamp-2">
            {description}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={`${name}-${index}`} className="text-[12px] text-accent-purple bg-accent-purple/10 px-2 py-1 rounded-full border border-accent-purple/20">
              #{tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Modal for full description */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#100d25] p-8 rounded-2xl w-full max-w-2xl border border-white/10 shadow-2xl relative">
             <button
                onClick={toggleModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
             >
                &times;
             </button>
            <h3 className="text-white font-bold text-[30px] mb-4 text-gradient">{name}</h3>
            <div className="w-full h-[200px] mb-6 rounded-xl overflow-hidden">
                 <img src={imageUrl} alt={name} className="w-full h-full object-cover"/>
            </div>
            <p className="text-gray-300 text-[16px] leading-[1.8]">{description}</p>
             <div className="mt-6 flex gap-4">
               {liveDemoLink && (
                  <a href={liveDemoLink} target="_blank" rel="noopener noreferrer" className="primary-btn text-sm">Live Demo</a>
               )}
               {githubLink && (
                  <a href={githubLink} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition-colors text-sm">GitHub</a>
               )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};



const Works = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // default to 'all'

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, "byteedocprojects");
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
      <div className="flex gap-4 mb-2 mt-2 justify-center flex-wrap">
        {["all", "web", "mobile", "other"].map((tab) => (
            <button
            key={tab}
            className={`${
                activeTab === tab 
                ? "bg-accent text-primary shadow-[0_0_10px_#00F0FF]" 
                : "bg-glass-white text-gray-300 hover:bg-white/20"
            } py-2 px-6 rounded-full font-medium transition-all duration-300 capitalize`}
            onClick={() => filterProjects(tab)}
            >
            {tab === "other" ? "Others" : tab === "all" ? "All" : `${tab} Apps`}
            </button>
        ))}
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
