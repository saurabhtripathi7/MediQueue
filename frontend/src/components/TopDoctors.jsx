import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors = [] } = useContext(AppContext);

  /**
   * TOP DOCTORS LOGIC
   * 1. Prefer AVAILABLE doctors
   * 2. Sort by EXPERIENCE (descending)
   * 3. Take top 10
   * 4. Fallback if < 10 available
   */
  const topDoctors = useMemo(() => {
    if (!doctors.length) return [];

    const availableDoctors = doctors.filter(doc => doc.available);

    const source =
      availableDoctors.length >= 10 ? availableDoctors : doctors;

    return [...source]
      .sort((a, b) => {
        const expA = parseInt(a.experience) || 0;
        const expB = parseInt(b.experience) || 0;
        return expB - expA;
      })
      .slice(0, 10);
  }, [doctors]);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 dark:text-gray-50 md:mx-10 px-3">
      {/* HEADING */}
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>

      {/* SUBTEXT */}
      <p className="sm:w-1/3 text-center text-sm text-gray-600 dark:text-gray-400">
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* EMPTY STATE */}
      {topDoctors.length === 0 && (
        <p className="text-sm text-gray-500 mt-6">
          No doctors available at the moment.
        </p>
      )}

      {/* SCROLL CONTAINER */}
      {topDoctors.length > 0 && (
        <div className="w-full overflow-x-auto sm:overflow-visible scrollbar-hide py-4">
          {/* FLEX (MOBILE) → GRID (DESKTOP) */}
          <div
            className="
              flex sm:grid
              sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5
              gap-4 pt-5 gap-y-6
            "
          >
            {topDoctors.map((item) => {
              const isAvailable = item.available;

              return (
                <div
                  key={item._id}
                  onClick={() => {
                    navigate(`/appointment/${item._id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="
                    min-w-[16rem] sm:min-w-0 shrink-0
                    border border-blue-200 dark:border-gray-700
                    bg-white dark:bg-gray-800
                    rounded-xl overflow-hidden cursor-pointer
                    hover:-translate-y-2 transition-all duration-300
                  "
                >
                  {/* IMAGE */}
                  <div className="w-full aspect-square bg-blue-50 dark:bg-gray-700 relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="
                        absolute inset-0 w-full h-full
                        object-cover object-top
                        hover:scale-105 transition-transform duration-500
                      "
                    />
                  </div>

                  {/* CARD BODY */}
                  <div className="p-4">
                    {/* AVAILABILITY */}
                    <div
                      className={`flex items-center gap-2 text-xs mb-2 ${
                        isAvailable ? "text-green-500" : "text-gray-500"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isAvailable ? "bg-green-500" : "bg-gray-500"
                        }`}
                      />
                      <p>{isAvailable ? "Available" : "Not Available"}</p>
                    </div>

                    {/* NAME */}
                    <p className="text-gray-900 dark:text-white text-lg font-medium leading-tight mb-1">
                      {item.name}
                    </p>

                    {/* SPECIALITY */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.speciality}
                    </p>

                    {/* EXPERIENCE */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Experience: {item.experience}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SHOW MORE BUTTON */}
      <button
        onClick={() => {
          navigate("/doctors");
          window.scrollTo(0, 0);
        }}
        className="
          group relative
          bg-transparent
          border border-gray-400 dark:border-gray-600
          text-gray-600 dark:text-gray-300
          px-10 py-3 rounded-full mt-6
          font-medium text-sm uppercase tracking-wide
          transition-all duration-300 ease-in-out

          hover:bg-blue-600 hover:text-white hover:border-blue-600
          dark:hover:bg-blue-500 dark:hover:border-blue-500
          hover:shadow-lg hover:-translate-y-1
          active:scale-95
        "
      >
        <span className="flex items-center gap-2">
          Show more
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </button>
    </div>
  );
};

export default TopDoctors;
