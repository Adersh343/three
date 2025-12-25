import React from 'react';
import logo from '../assets/logo.svg';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-primary py-8 border-t border-white/10 relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
           <img src={logo} alt="Byteedoc" className="w-10 h-10 object-contain rounded-full bg-white/10 p-1" />
           <p className="text-gray-400 text-sm">© 2024 Byteedoc. All rights reserved.</p>
        </div>

        <div className="flex gap-6">
            {[FaTwitter, FaFacebook, FaInstagram, FaLinkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="text-gray-400 hover:text-accent transition-colors text-xl">
                    <Icon />
                </a>
            ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
