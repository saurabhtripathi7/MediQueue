import React from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";

const Home = () => {
  return (
    /* Global Page Background: Smooth transition between soft white and professional slate */
    <div className="min-h-screen bg-[#FDFEFF] dark:bg-slate-950 transition-colors duration-700 ease-in-out overflow-x-hidden">
      
      {/* Hero Header Section */}
      <Header />

      {/* Main content wrapper with consistent large width and spacing */}
      <div className="w-full flex flex-col items-center pb-24 space-y-24 md:space-y-36">
        
        {/* Section 1: Specialities */}
        <SpecialityMenu />

        {/* Section 2: Top Doctors */}
        <TopDoctors />

        {/* Section 3: Banner */}
        <Banner />

      </div>
    </div>
  );
};

export default Home;