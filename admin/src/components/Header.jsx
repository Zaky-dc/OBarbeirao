import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { CiSearch } from "react-icons/ci";
import { CiFilter } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { IoMdSunny } from "react-icons/io";
import { FaRegBell } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const [query, setQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  const imageUrl =
    "https://i.pinimg.com/1200x/0c/5c/02/0c5c026703bc14a4ec4e557c0735308e.jpg";
  return (
    <div
      className="bg-white/-80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50
    dark:border-slate-700/50 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/*Left session */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <GiHamburgerMenu className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <h1 className="text-2xl font-black text-slate-800 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm font-black text-slate-800 dark:text-white">
              Bem vindo Admin
            </p>
          </div>
        </div>
        {/*Center */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <CiSearch
              className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2
                text-slate-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="search anything"
              className="w-full pl-10 pr-4 py-2.5 
                bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                rounded-xl text-slate-800 dark:text-white placeholder-slate-800 focus:outline-none
                focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2  p-1.5 
                hover:text-slate-600 dark:hover:text-slate-300"
            >
              <CiFilter />
            </button>
          </div>
        </div>
        {/*Right */}
        <div className="flex items-center space-x-3">
          {/*user profile*/}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-700"
            >
              <img
                src={imageUrl}
                alt="user"
                className="w-8 h-8 rounded-full ring-2 ring-blue-500 object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Alde Nacoma
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Admin
                </p>
              </div>
              <FaAngleDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Dropdown */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-slate-700"
                >
                  Terminar Sessão
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
