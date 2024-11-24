import { BrowserRouter } from "react-router-dom";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Experience from "./components/Experience";
import Tech from "./components/Tech";
import Works from "./components/Works";
import Feedbacks from "./components/Feedbacks";
import Contact from "./components/Contact";
import Footer from "./components/Footer";


const App = () => {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-[#000606]'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
          <Hero />
        </div>
         <About />
        <Experience />

        <Tech />
        <Works />

        <Feedbacks />
        <div className='relative z-0'>
          <Contact />
          {/* <StarsCanvas /> */}
        </div> 
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;
