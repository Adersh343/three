import React from 'react'
import { Navbar } from 'reactstrap'
import Hero from '../components/Hero'
import About from '../components/About'
import Experience from '../components/Experience'
import Tech from '../components/Tech'
import Feedbacks from '../components/Feedbacks'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Works from '../components/Works'

const LandingPages = () => {
    return (
        <div className="relative z-0">
            <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
                <Hero />
            </div>
            <About />
            <Experience />
            <Tech />
            <Works />
            <Feedbacks />
            <div className="relative z-0">
                <Contact />
            </div>
     </div>
    )
}

export default LandingPages