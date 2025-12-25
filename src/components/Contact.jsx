import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp} from "firebase/firestore";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, OrbitControls } from "@react-three/drei";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const AnimatedGlobe = () => {
    return (
        <Sphere args={[1, 64, 64]} scale={2.5}>
            <meshStandardMaterial
                color="#2A0E61"
                wireframe
                transparent
                opacity={0.3}
            />
        </Sphere>
    )
}

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "byteedoccontacts"), {
        name: form.name,
        email: form.email,
        message: form.message,
        timestamp: serverTimestamp(),
      });

      setLoading(false);
      alert("Thank you! Your message has been received.");

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (e) {
      setLoading(false);
      console.error("Error adding document: ", e);
      alert("Ahh, something went wrong. Please try again.");
    }
  };

  return (
    <div className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}>
      <motion.div variants={slideIn("left", "tween", 0.2, 1)} className='flex-[0.75] glass-panel p-8 rounded-2xl'>
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        <form ref={formRef} onSubmit={handleSubmit} className='mt-12 flex flex-col gap-8'>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Name</span>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder="What's your good name?"
              className='bg-glass-dark py-4 px-6 placeholder:text-gray-500 text-white rounded-lg outline-none border border-white/10 focus:border-accent font-medium transition-colors'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your email</span>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder="What's your web address?"
              className='bg-glass-dark py-4 px-6 placeholder:text-gray-500 text-white rounded-lg outline-none border border-white/10 focus:border-accent font-medium transition-colors'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Message</span>
            <textarea
              rows={7}
              name='message'
              value={form.message}
              onChange={handleChange}
              placeholder='What you want to say?'
              className='bg-glass-dark py-4 px-6 placeholder:text-gray-500 text-white rounded-lg outline-none border border-white/10 focus:border-accent font-medium transition-colors'
            />
          </label>

          <button type='submit' className='primary-btn w-fit shadow-md shadow-primary'>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>

      <motion.div variants={slideIn("right", "tween", 0.2, 1)} className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px]'>
         <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 0, 5]} intensity={1} />
            <AnimatedGlobe />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
         </Canvas>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
