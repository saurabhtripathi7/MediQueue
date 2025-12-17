import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 dark:text-gray-50 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>

      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* GRID */}
      <div className="w-full grid grid-cols-auto-fit gap-4 pt-5 px-3 sm:px-0">
        {doctors.slice(0, 10).map((item) => {
          // ✅ Default availability if backend field is missing
          const isAvailable = item.available ?? true;

          return (
            <div
              key={item._id}
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                scrollTo(0, 0);
              }}
              className="border border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-3.5 transition-all duration-300"
            >
              <img
                className="bg-blue-50 dark:bg-gray-700 h-40 w-full object-cover"
                src={item.image}
                alt={item.name}
              />

              <div className="p-4">
                {/* AVAILABILITY */}
                <div
                  className={`flex items-center gap-2 text-sm ${
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
                <p className="text-gray-900 dark:text-white text-lg font-medium">
                  {item.name}
                </p>

                {/* SPECIALITY */}
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.speciality}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* BUTTON */}
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="
          group
          bg-blue-50 text-gray-600
          dark:bg-gray-800 dark:text-gray-300
          px-12 py-3 rounded-full mt-10
          font-medium
          transition-all duration-300 ease-out
          hover:bg-blue-100 hover:text-blue-700
          dark:hover:bg-gray-700 dark:hover:text-white
          hover:-translate-y-1 hover:shadow-md
          active:scale-95
        "
      >
        <span className="flex items-center gap-2">
          More
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </button>
    </div>
  );
};

export default TopDoctors;
