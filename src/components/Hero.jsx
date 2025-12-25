import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const StarBackground = (props) => {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.2 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const AnimatedSphere = () => {
    return (
        <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
            <Sphere args={[1, 100, 200]} scale={2.5}>
                <MeshDistortMaterial
                    color="#2A0E61"
                    attach="material"
                    distort={0.5}
                    speed={2}
                    roughness={0}
                    metalness={0.5} 
                />
            </Sphere>
        </Float>
    )
}

const Hero = () => {
  const [heroData, setHeroData] = useState({
    heading: "",
    subheading: "",
    cvUrl: "",
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, "byteedocheroSection", "1");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHeroData(prev => ({ ...prev, ...docSnap.data() }));
        }

        const cvDocRef = doc(db, "byteedoccvSection", "1");
        const cvDocSnap = await getDoc(cvDocRef);
        if (cvDocSnap.exists()) {
          setHeroData(prev => ({ ...prev, cvUrl: cvDocSnap.data().cvUrl }));
        }
      } catch (error) {
        console.error("Error fetching hero data: ", error);
      }
    };
    fetchHeroData();
  }, []);

  const handleDownloadCv = () => {
    if (heroData.cvUrl) {
      const link = document.createElement('a');
      link.href = heroData.cvUrl;
      link.download = 'CV.pdf';
      link.click();
    } else {
      alert("CV is not available.");
    }
  };

  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 bg-primary">
          <Canvas camera={{ position: [0, 0, 1] }}>
              <StarBackground />
              <ambientLight intensity={0.5} />
              <directionalLight position={[0, 0, 5]} />
          </Canvas>
      </div>

      <div className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5 z-10 pointer-events-none`}>
        {/* Decorative Line */}
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
          <div className='w-1 sm:h-80 h-40 violet-gradient' />
        </div>

        {/* Text Content */}
        <div className="pointer-events-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`${styles.heroHeadText} text-white font-heading`}
          >
            {heroData.heading || "Hi, I'm"} <span className="text-[#915EFF]">{heroData.subheading || "Pritam"}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`${styles.heroSubText} mt-2 text-white-100 max-w-xl`}
          >
            I develop 3D visuals, user <br className='sm:block hidden' />
            interfaces and web applications
          </motion.p>
          
          {/* CTA Buttons */}
          <div className="mt-10 flex gap-5">
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={handleDownloadCv}
                className="py-3 px-8 bg-gradient-to-r from-[#915EFF] to-[#2A0E61] rounded-xl text-white font-bold shadow-lg shadow-[#2A0E61]/50 border border-white/10 hover:shadow-cyan-500/50"
              >
                  Download CV
              </motion.button>
              
              <a href="#about" className="pointer-events-auto">
                 <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="py-3 px-8 bg-transparent text-white font-bold rounded-xl border border-white/20 hover:bg-white/10 backdrop-blur-sm"
                  >
                      Explore Work
                  </motion.button>
              </a>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center z-10'>
        <a href='#about'>
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
              }}
              className='w-3 h-3 rounded-full bg-secondary mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
