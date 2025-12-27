import React from "react";
import { Route, Routes } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

// Images
import lightBg from "./assets/bluePurpleYellowGradient.png";
import darkBg from "./assets/darkGradient.png"; 

import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointments from "./pages/Appointments";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  // Get the current theme
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-light-gradient bg-cover bg-center bg-no-repeat dark:bg-slate-900">
      <ToastContainer />
      {/* Content wrapper */}
      <div
        className="min-h-screen transition-all duration-500" // Added transition for smooth switch
        style={{
          // Dynamic background logic
          backgroundImage: theme === 'light' 
            ? `url(${lightBg})` // Uses lightBg image if theme is dark
            : `url(${darkBg})`, // Uses darkBg image if theme is dark
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/appointment/:doctorId" element={<Appointments />} />
        </Routes>

        <Footer />
      </div>
    </div>
  );
};

export default App;