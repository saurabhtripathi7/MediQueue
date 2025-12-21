import React from "react";
import { Route, Routes } from "react-router-dom";
import gradientBg from "./assets/bluePurpleYellowGradient.png";


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


const App = () => {
  return (
    <div
      className="
        min-h-screen
        bg-light-gradient
        bg-cover bg-center bg-no-repeat
        dark:bg-slate-900
      "
    >
      {/* Content wrapper */}
      <div className="min-h-screen" style={{
    backgroundImage: `url(${gradientBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}>
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
          <Route path="/appointment/:docId" element={<Appointments />} />
        </Routes>

        <Footer />
      </div>
    </div>
  );
};


export default App;
