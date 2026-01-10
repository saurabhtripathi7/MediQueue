import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import ScrollToTop from "./components/ScrollToTop";

/* ===================== ASSETS ===================== */
import lightBg from "./assets/bluePurpleYellowGradient.png";
import darkBg from "./assets/darkGradient.png";

/* ===================== PAGES ===================== */
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointments from "./pages/Appointments";

/* ===================== LAYOUT ===================== */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* ===================== TOAST ===================== */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { theme } = useTheme();
  const location = useLocation();

  // Logic: Only the Home page needs to slide under the Navbar
  const isHomePage = location.pathname === "/";

  return (
    <div
      className="min-h-screen flex flex-col transition-all duration-700 bg-fixed bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${theme === "light" ? lightBg : darkBg})`,
      }}
    >
      <ScrollToTop />
      <ToastContainer position="bottom-right" theme={theme} autoClose={3000} />

      <Navbar />

      <main 
        className={`grow overflow-visible transition-all duration-500 
          ${isHomePage ? "-mt-24" : "mt-4"}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/appointment/:doctorId" element={<Appointments />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;