import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { specialityData } from "../assets/assets";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors = [] } = useContext(AppContext);

  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // ================= FILTER-LOGIC =================
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
    <div className="px-3 sm:px-6 md:px-10 mt-5 mx-auto max-w-screen-2xl h-[calc(100vh-80px)] flex gap-30">
      
      {/* ================= LEFT FIXED SIDEBAR ================= */}
      <div className="hidden sm:flex flex-col justify-center gap-6 w-64 shrink-0 sticky top-24 self-start">
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          Browse through the doctors specialist.
        </p>

        <div className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-300">
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

      {/* ================= MOBILE FILTER ================= */}
      <div className="sm:hidden mb-4">
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg font-medium">
          Browse through the doctors specialist.
        </p>

        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {specialityData.map((item) => (
            <div
              key={item.speciality}
              onClick={() => handleFilterClick(item.speciality)}
              className={`
                shrink-0 px-3 py-2 rounded-full border text-sm whitespace-nowrap cursor-pointer transition-all
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

      {/* ================= RIGHT SCROLLABLE GRID ================= */}
      <div className="flex-1 overflow-y-auto pr-2 scroll-smooth mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {filteredDoctors.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="group border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden">
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

          {/* EMPTY STATE */}
          {filteredDoctors.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
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
