import React from 'react';
import logo from '../assets/logo.svg';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Import the React icons

const Footer = () => {
  const companyMenu = [
    { name: 'About', link: '#' },
    { name: 'Features', link: '#' },
    { name: 'Works', link: '#' },
    { name: 'Career', link: '#' },
  ];

  const helpMenu = [
    { name: 'Customer Support', link: '#' },
    { name: 'Delivery Details', link: '#' },
    { name: 'Terms & Conditions', link: '#' },
    { name: 'Privacy Policy', link: '#' },
  ];

  return (
    <div>
      <section className="py-10 bg-tertiary sm:pt-16 lg:pt-24">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
            <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
              <img className="w-auto h-20" src={logo} alt="Logo" />
              <p className="text-base leading-relaxed text-gray-600 mt-7">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
                Velit officia consequat duis enim velit mollit.
              </p>
              <ul className="flex items-center space-x-3 mt-9">
                <li>
                  <a
                    href="#"
                    title="Twitter"
                    className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-secondary focus:bg-blue-600"
                  >
                    <FaTwitter className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    title="Facebook"
                    className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-secondary focus:bg-blue-600"
                  >
                    <FaFacebook className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    title="Instagram"
                    className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-secondary focus:bg-blue-600"
                  >
                    <FaInstagram className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    title="LinkedIn"
                    className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-secondary focus:bg-blue-600"
                  >
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Menu */}
            <div>
              <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Company</p>
              <ul className="mt-6 space-y-4">
                {companyMenu.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.link}
                      title={item.name}
                      className="flex text-base text-secondary transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help Menu */}
            <div>
              <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Help</p>
              <ul className="mt-6 space-y-4">
                {helpMenu.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.link}
                      title={item.name}
                      className="flex text-base text-secondary transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Section */}
            <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
              <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Subscribe to newsletter</p>
              <form action="#" method="POST" className="mt-6">
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-secondary/20 border border-secondary rounded-md focus:outline-none focus:border-secondary caret-blue-600"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-4 mt-3 font-semibold text-white transition-all duration-200 bg-secondary/20 rounded-md hover:bg-secondary/60 focus:bg-blue-700"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <hr className="mt-16 mb-10 border-gray-200" />
          <p className="text-sm text-center text-gray-600">© Copyright 2021, All Rights Reserved by Postcraft</p>
        </div>
      </section>
    </div>
  );
};

export default Footer;
