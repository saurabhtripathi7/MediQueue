import React from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero / Header (no animation on full page) */}
      <Header />

      {/* Main content wrapper */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-20 space-y-20">
        
        {/* Section 1: Specialities */}
        <section className="bg-white/90 dark:bg-gray-900 rounded-2xl shadow-sm p-6 sm:p-8">
          <SpecialityMenu />
        </section>

        {/* Section 2: Top Doctors */}
        <section className="bg-white/90 dark:bg-gray-900 rounded-2xl shadow-sm p-6 sm:p-8">
          <TopDoctors />
        </section>

        {/* Section 3: Banner */}
        <section className="dark:bg-gray-900 rounded-2xl ">
          <Banner />
        </section>

      </div>
    </div>
  );
};

export default Home;