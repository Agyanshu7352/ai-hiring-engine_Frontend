import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-[#CBFFCE] w-full">
      <div className="max-w-7xl mx-auto px-6 py-10 text-center">

        <h3 className="text-lg font-bold text-gray-600 mb-2">
          AI Hiring Engine
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          Smarter hiring powered by AI resume intelligence
        </p>

        <div className="flex justify-center gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-[#106EE8] transition">
            Privacy
          </a>
          <a href="#" className="hover:text-[#106EE8] transition">
            Terms
          </a>
          <a href="#" className="hover:text-[#106EE8] transition">
            Contact
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} AI Hiring Engine. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
