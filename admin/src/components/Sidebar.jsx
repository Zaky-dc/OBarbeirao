import React from "react";
import { FiZap } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoBarChartOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuPackage } from "react-icons/lu";
import { CiCreditCard2 } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { CiCalendarDate } from "react-icons/ci";
import { LuFileText } from "react-icons/lu";
import { TbReportMoney } from "react-icons/tb";
import { Scissors } from "lucide-react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

const Sidebar = () => {
  const { collapsed } = useSidebar();

  const imageUrl =
    "https://i.pinimg.com/1200x/0c/5c/02/0c5c026703bc14a4ec4e557c0735308e.jpg";
  const menuItems = [
    { id: "", icon: <LuLayoutDashboard />, label: "Dashboard" },
    { id: "fila", icon: <MdOutlineShoppingBag />, label: "Fila de Clientes" },
    { id: "agendamentos", icon: <CiCalendarDate />, label: "Agendamentos" },
    { id: "servicos", icon: <LuPackage />, label: "Serviços" },
    {id:"upload-galeria",icon:<FaPlus/>,label:"Carregar Imagem Galeria"},
    { id: "upload-servico", icon: <FaPlus />, label: "Cadastrar Serviço" },
    { id: "relatorio", icon: <IoBarChartOutline />, label: "Relatório" },
    { id: "barbeiros", icon: <FaRegUser />, label: "Stuff" },
    { id: "fecho", icon: <TbReportMoney />, label: "Fecho Mensal" },
    
  ];

  return (
    <div
      className={clsx(
        "transition-all duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80 border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col relative z-10",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/*Logo */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-700 to-black rounded-xl flex items-center justify-center shadow-lg">
            <Scissors className="w-6 h-6 text-indigo-400" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                O Barbeirão
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Admin Panel
              </p>
            </div>
          )}
        </div>
      </div>
      {/*Navigations */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto ">
        {menuItems.map((elem) => (
          <div key={elem.id}>
            <Link
              to={`/${elem.id}`}
              className={clsx(
                "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-slate-800 dark:text-white">{elem.icon}</div>
                <>
                  <span
                    className={clsx("font-medium ml-2 text-slate-800 dark:text-white", collapsed && "hidden")}
                  >
                    {elem.label}
                  </span>

                  {elem.badge && (
                    <span className="px-2 py-1 text-xs bg-red-500/45 text-white rounded-full">
                      {elem.badge}
                    </span>
                  )}
                  {elem.count && (
                    <span
                      className="px-2 py-1 text-xs bg-slate-200 dark:text-slate-300 dark:bg-slate-700 text-slate-600
                rounded-full"
                    ></span>
                  )}
                </>
              </div>
            </Link>
          </div>
        ))}
      </nav>

      {/*user profile*/}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <div
          className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 
        dark:bg-slate-800/50"
        >
          <img
            src={imageUrl}
            alt="user"
            className="w-10 h-10 rounded-full ring-2 ring-blue-500 object-cover"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                Alde Nacoma
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Admin
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
