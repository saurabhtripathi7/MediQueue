import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { specialityData } from "../assets/assets";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors = [] } = useContext(AppContext);

  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  // Filter doctors based on URL param
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
    setShowFilter(false);
  };

  return (
    <div className="px-3 sm:px-6 md:px-10">
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Browse through the doctors specialist.
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Filters */}
        <div className="sm:w-60">
          <button
            onClick={() => setShowFilter((p) => !p)}
            className={`sm:hidden mb-3 py-1 px-3 border rounded text-sm transition-colors ${
              showFilter
                ? "bg-primary text-white"
                : "dark:text-white dark:border-gray-600"
            }`}
          >
            Filters
          </button>

          <div
            className={`flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-300 ${
              showFilter ? "flex" : "hidden sm:flex"
            }`}
          >
            {specialityData.map((item) => (
              <div
                key={item.speciality}
                onClick={() => handleFilterClick(item.speciality)}
                // 1. FILTER BUTTONS: Added dark:border-gray-600, dark:bg-gray-800, dark:text-white
                className={`flex items-center gap-3 pl-3 py-2 border rounded cursor-pointer transition-all ${
                  speciality === item.speciality
                    ? "bg-indigo-100 text-black dark:bg-indigo-900 dark:text-white border-indigo-100 dark:border-indigo-900"
                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.speciality}
                  className="w-6 h-6 bg-white rounded-sm p-0.5" // Added small bg for icons in case they are transparent
                />
                <span className="text-sm">{item.speciality}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div
          className="
            flex-1 grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6
          "
        >
          {filteredDoctors.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/appointment/${item._id}`)}
              // 2. CARD CONTAINER: Added dark:bg-gray-800 and dark:border-gray-700
              className="border border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300"
            >
              <div className="h-36 w-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full max-w-full object-contain"
                />
              </div>

              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm ${
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

                {/* 4. TEXT COLORS: Added dark:text-white and dark:text-gray-400 */}
                <p className="text-gray-900 dark:text-white text-lg font-medium">
                  {item.name}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.speciality}
                </p>
              </div>
            </div>
          ))}

          {filteredDoctors.length === 0 && (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
              No doctors found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
