import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { specialityData } from "../assets/assets";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors = [] } = useContext(AppContext);

  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    if (!doctors || doctors.length === 0) {
      setFilteredDoctors([]);
      return;
    }
    if (speciality) {
      setFilteredDoctors(
        doctors.filter((doc) => doc.speciality === speciality)
      );
    } else {
      setFilteredDoctors(doctors);
    }
  }, [doctors, speciality]);

  const handleFilterClick = (spec) => {
    navigate(spec === speciality ? "/doctors" : `/doctors/${spec}`);
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 mt-5 mx-auto max-w-screen-2xl">
      
      {/* LAYOUT FIX:
        1. Changed 'gap-30' to 'gap-6' (mobile) and 'lg:gap-10' (desktop) so it fits on screens.
        2. Added 'flex-col' for mobile so items stack, 'sm:flex-row' for desktop so they sit side-by-side.
        3. Applied fixed height 'h-[calc...]' ONLY on desktop (sm) so mobile scrolls naturally.
      */}
      <div className="flex flex-col sm:flex-row gap-6 lg:gap-10 sm:h-[calc(100vh-80px)]">

        {/* ================= LEFT FIXED SIDEBAR ================= */}
        {/* Only visible on sm screens and up. No scroll here, it stays fixed. */}
        <div className="hidden sm:flex flex-col gap-6 w-64 shrink-0">
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Browse through the doctors specialist.
          </p>

          <div className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-300 overflow-y-auto">
            {specialityData.map((item) => (
              <div
                key={item.speciality}
                onClick={() => handleFilterClick(item.speciality)}
                className={`
                  flex items-center gap-3 pl-3 py-2.5 border rounded-lg cursor-pointer transition-all
                  ${
                    speciality === item.speciality
                      ? "bg-indigo-50 dark:bg-indigo-900/50 text-primary border-indigo-200 font-medium"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }
                `}
              >
                {speciality === item.speciality && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
                {item.speciality}
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT SIDE (SCROLLABLE CONTAINER) ================= */}
        {/* On Mobile: auto height. On Desktop: overflow-y-scroll to create the independent scroll effect */}
        <div className="flex-1 w-full sm:overflow-y-scroll sm:pr-4 scroll-smooth">
          
          {/* MOBILE FILTER (Only visible on small screens) */}
          <div className="sm:hidden mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg font-medium">
              Browse through the doctors specialist.
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {specialityData.map((item) => (
                <div
                  key={item.speciality}
                  onClick={() => handleFilterClick(item.speciality)}
                  className={`
                    shrink-0 px-4 py-2 rounded-full border text-sm whitespace-nowrap cursor-pointer transition-all
                    ${
                      speciality === item.speciality
                        ? "bg-primary text-white border-primary"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                    }
                  `}
                >
                  {item.speciality}
                </div>
              ))}
            </div>
          </div>

          {/* DOCTORS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
            {filteredDoctors.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/appointment/${item._id}`)}
                className="group border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-50 dark:bg-gray-700">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-4">
                  <div
                    className={`flex items-center gap-2 text-xs mb-2 ${
                      item.available ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.available ? "bg-green-500" : "bg-gray-500"
                      }`}
                    />
                    {item.available ? "Available" : "Not Available"}
                  </div>

                  <h3 className="text-gray-900 dark:text-white text-lg font-semibold truncate">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {item.speciality}
                  </p>
                </div>
              </div>
            ))}

            {filteredDoctors.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-lg font-medium">No doctors found</p>
                <p className="text-sm">Try selecting a different specialty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;