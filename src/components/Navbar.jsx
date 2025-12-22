import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../config/navConfig';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="w-full bg-[#90E0AB] border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div className="text-xl font-bold text-[#106EE8]">
          AI Hiring Engine
        </div>

        {/* LINKS */}
        <div className="flex items-center gap-6 text-sm font-medium">
          {NAV_ITEMS
            .filter(item => !item.hideOn.includes(currentPath))
            .map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition ${
                  currentPath === item.path
                    ? 'text-[#106EE8] font-semibold'
                    : 'text-gray-800 hover:text-[#106EE8]'
                }`}
              >
                {item.label}
              </Link>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
