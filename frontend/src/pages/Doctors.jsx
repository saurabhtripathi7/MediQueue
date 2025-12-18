import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { specialityData } from "../assets/assets";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors = [] } = useContext(AppContext);

  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // --- Filter Logic ---
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

  // --- Click Handler ---
  const handleFilterClick = (spec) => {
    // If clicking the same filter again, go back to "All Doctors"
    navigate(spec === speciality ? "/doctors" : `/doctors/${spec}`);
  };

  return (
    <div className="px-3 sm:px-6 md:px-10 mt-5 mb-10">
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg font-medium">
        Browse through the doctors specialist.
      </p>

      {/* ================= MOBILE FILTER (Horizontal Scroll) ================= */}
      {/* Visible only on small screens (sm:hidden) */}
      <div className="sm:hidden mb-8">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide w-full px-1">
          {specialityData.map((item) => (
            <div
              key={item.speciality}
              onClick={() => handleFilterClick(item.speciality)}
              className={`
                shrink-0 px-3 py-2 rounded-full border text-sm whitespace-nowrap cursor-pointer transition-all duration-200
                ${
                  speciality === item.speciality
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/30"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400"
                }
              `}
            >
              {item.speciality}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        
        {/* ================= DESKTOP FILTER (Sidebar) ================= */}
        {/* Visible only on larger screens (hidden sm:flex) */}
        <div className="hidden sm:flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-300 min-w-56">
          {specialityData.map((item) => (
            <div
              key={item.speciality}
              onClick={() => handleFilterClick(item.speciality)}
              className={`
                flex items-center gap-3 pl-3 py-2.5 border rounded-lg cursor-pointer transition-all duration-200
                ${
                  speciality === item.speciality
                    ? "bg-indigo-50 dark:bg-indigo-900/50 text-primary dark:text-indigo-200 border-indigo-100 dark:border-indigo-800 font-medium"
                    : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }
              `}
            >
              {/* Optional: Active Dot Indicator */}
              {speciality === item.speciality && (
                 <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
              )}
              <span className="text-sm">{item.speciality}</span>
            </div>
          ))}
        </div>

        {/* ================= DOCTORS GRID ================= */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDoctors.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="group border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Container with Uniform Aspect Ratio */}
              <div className="w-full aspect-4/4 bg-blue-50 dark:bg-gray-700/50 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  /* object-cover: Fills the box
                    object-top: Anchors image to top (Head visible)
                    absolute inset-0: Prevents layout shifts
                  */
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4">
                {/* Availability Status */}
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
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>

                {/* Doctor Info */}
                <h3 className="text-gray-900 dark:text-white text-lg font-semibold leading-tight mb-1">
                  {item.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.speciality}
                </p>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredDoctors.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
               <p className="text-lg font-medium">No doctors found</p>
               <p className="text-sm">Try selecting a different specialty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;