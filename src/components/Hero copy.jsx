import { motion } from "framer-motion";
import { styles } from "../styles";
import imagePath from "../assets/comp.svg"; // Import the image you want to use

const Hero = () => {
  return (
    <section className={`relative w-full h-screen mx-auto`}>
      <div
        className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-col items-start gap-5`}
      >
        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, Byteedoc <span className="text-secondary2">Coding Family</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            we are here for <br className="sm:block hidden" />
            interfaces and web applications
          </p>
        </div>

        {/* Image positioned below the heading and description */}
        <div className=" w-full flex justify-center">
          <img
            src={imagePath} // Use the imported image
            alt="Hero Image"
            className="object-contain max-w-full h-auto" // Adjust the image styling
          />
        </div>
      </div>

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
    </section>
  );
};

export default Hero;
