import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaWallet,
  FaChartPie,
  FaCog,
  FaFileAlt,
  FaBars,
} from "react-icons/fa";

import { useState } from "react";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      animate={{
        width: collapsed ? 92 : 270,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <div className="logo sidebar-logo">
        <FaWallet />

        {!collapsed && <h2>SpendWise</h2>}
      </div>

      <button
        className="collapse-btn"
        onClick={() => setCollapsed(!collapsed)}
      >
        <FaBars />
      </button>

      <nav>
        <NavLink to="/">
          <FaChartPie />
          {!collapsed && <span>Painel</span>}
        </NavLink>

        <NavLink to="/reports">
          <FaFileAlt />
          {!collapsed && <span>Relatórios</span>}
        </NavLink>

        <NavLink to="/settings">
          <FaCog />
          {!collapsed && <span>Configurações</span>}
        </NavLink>
      </nav>
    </motion.aside>
  );
}

export default Sidebar;