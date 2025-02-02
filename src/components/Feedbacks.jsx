import React, { useState, useEffect } from "react";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { db } from "../../firebase";  // import Firebase db
import { collection, getDocs } from "firebase/firestore";  // Firestore functions
import { motion } from "framer-motion";  // Importing Framer Motion for animation

const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -100 }}  // Start from left side
    animate={{ opacity: 1, x: 0 }}     // End at normal position
    transition={{
      type: "spring",
      stiffness: 100,
      delay: index * 0.2,  // Add delay for staggered animation
    }}
    className="bg-black-200 p-10 rounded-3xl xs:w-[320px] w-full"
  >
    <p className="text-white font-black text-[48px]">"</p>

    <div className="mt-1">
      <p className="text-white tracking-wider text-[18px]">{testimonial}</p>

      <div className="mt-7 flex justify-between items-center gap-1">
        <div className="flex-1 flex flex-col">
          <p className="text-white font-medium text-[16px]">
            <span className="blue-text-gradient">@</span> {name}
          </p>
          <p className="mt-1 text-secondary text-[12px]">
            {designation} of {company}
          </p>
        </div>

        <img
          src={image}
          alt={`feedback_by-${name}`}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </div>
  </motion.div>
);

const Feedbacks = () => {
  const [testimonialsData, setTestimonialsData] = useState([]);

  // Fetch testimonials from Firestore
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "byteedoctestimonials"));
        const testimonialsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTestimonialsData(testimonialsList);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className={`mt-12 bg-black-100 rounded-[20px]`}>
      <div className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[300px]`}>
        <p className={styles.sectionSubText}>What others say</p>
        <h2 className={styles.sectionHeadText}>Testimonials.</h2>
      </div>
      <div className={`-mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-7`}>
        {testimonialsData.length > 0 ? (
          testimonialsData.map((testimonial, index) => (
            <FeedbackCard key={testimonial.id} index={index} {...testimonial} />
          ))
        ) : (
          <p className="text-white text-center">Loading Testimonials...</p>
        )}
      </div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, "");
