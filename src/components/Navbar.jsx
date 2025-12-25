import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full flex items-center py-4 fixed top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary/70 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto px-6 sm:px-10'>
        <Link
          to='/'
          className='flex items-center gap-2 group'
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-accent/50 group-hover:border-accent transition-colors">
             <img src={logo} alt='logo' className='w-full h-full object-contain bg-black' />
          </div>
          <p className='text-white text-[18px] font-heading font-bold cursor-pointer flex flex-col'>
            <span>Pritam <span className="text-secondary2 text-sm">Sharma</span></span>
          </p>
        </Link>

        {/* Desktop Navigation */}
        <ul className='list-none hidden sm:flex flex-row gap-10'>
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title ? "text-accent" : "text-gray-300"
              } hover:text-white text-[16px] font-medium cursor-pointer transition-colors relative group`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
              <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full ${active === nav.title ? "w-full" : ""}`}></span>
            </li>
          ))}
        </ul>

        {/* Mobile Navigation */}
        <div className='sm:hidden flex flex-1 justify-end items-center'>
          <img
            src={toggle ? close : menu}
            alt='menu'
            className='w-[28px] h-[28px] object-contain cursor-pointer opacity-80 hover:opacity-100 transition-opacity'
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 bg-glass-dark backdrop-blur-xl absolute top-20 right-4 mx-4 my-2 min-w-[200px] z-10 rounded-xl border border-white/10 shadow-glow slide-in-bottom`}
          >
            <ul className='list-none flex justify-end items-start flex-1 flex-col gap-6'>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-medium cursor-pointer text-[16px] ${
                    active === nav.title ? "text-accent" : "text-gray-300"
                  } hover:text-white transition-colors`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
