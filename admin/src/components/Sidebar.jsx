import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";

const Sidebar = () => {
  const { adminToken } = useContext(AdminContext);
  const { doctorToken } = useContext(DoctorContext);


  const adminMenu = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: assets.home_icon,
    },
    {
      name: "Appointments",
      path: "/all-appointments",
      icon: assets.appointment_icon,
    },
    {
      name: "Add Doctor",
      path: "/add-doctor",
      icon: assets.add_icon,
    },
    {
      name: "Doctors List",
      path: "/doctor-list",
      icon: assets.people_icon,
    },
  ];

  const doctorMenu = [
    {
      name: "Dashboard",
      path: "/doctor-dashboard",
      icon: assets.home_icon,
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: assets.appointment_icon,
    },
    {
      name: "Profile",
      path: "/doctor-profile",
      icon: assets.people_icon,
    },
  ];

  // Decide which menu to render
  const menuItems = adminToken ? adminMenu : doctorToken ? doctorMenu : [];

  return (
    <div className="min-h-screen bg-white border-r border-gray-200 w-16 md:w-64 transition-all duration-300">
      {menuItems.length > 0 && (
        <div className="flex flex-col gap-2 mt-5 text-[#515151]">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-3 md:px-8 cursor-pointer transition-all duration-200
                ${
                  isActive
                    ? "bg-[#F2F3FF] border-r-4 border-primary text-black"
                    : "hover:bg-gray-50 border-r-4 border-transparent"
                }`
              }
            >
              <img
                src={item.icon}
                alt={item.name}
                className="w-5 min-w-5"
              />
              <p className="hidden md:block font-medium">{item.name}</p>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
