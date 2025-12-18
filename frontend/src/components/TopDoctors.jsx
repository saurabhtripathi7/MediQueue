import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 dark:text-gray-50 md:mx-10 px-3">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>

      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* CONTAINER WRAPPER 
         1. 'w-full' ensures it spans the screen.
         2. 'overflow-x-auto' enables horizontal scrolling on mobile.
         3. 'scrollbar-hide' (custom CSS) keeps it clean.
      */}
      <div className="w-full overflow-x-auto sm:overflow-visible scrollbar-hide py-4">
        {/* GRID / FLEX HYBRID 
           - Mobile: 'flex' (creates a row).
           - Tablet/Desktop: 'sm:grid' (switches back to standard grid).
        */}
        <div
          className="
            flex sm:grid 
            sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 
            gap-4 pt-5 gap-y-6
          "
        >
          {doctors.slice(0, 10).map((item) => {
            const isAvailable = item.available ?? true;

            return (
              <div
                key={item._id}
                onClick={() => {
                  navigate(`/appointment/${item._id}`);
                  scrollTo(0, 0);
                }}
                /* CARD STYLING
                   - 'min-w-[16rem]': Prevents squishing on mobile flex view.
                   - 'flex-shrink-0': Ensures cards stay rigid while scrolling.
                */
                className="
                  min-w-[16rem] sm:min-w-0 shrink-0 
                  border border-blue-200 dark:border-gray-700 
                  bg-white dark:bg-gray-800 
                  rounded-xl overflow-hidden cursor-pointer 
                  hover:-translate-y-2 transition-all duration-300
                "
              >
                {/* IMAGE ASPECT RATIO FIX 
                   - 'aspect-square': Forces 1:1 ratio.
                   - 'object-top': Keeps head visible.
                */}
                <div className="w-full aspect-square bg-blue-50 dark:bg-gray-700 relative overflow-hidden">
                  <img
                    className="absolute inset-0 w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    src={item.image}
                    alt={item.name}
                  />
                </div>

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
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="
    group relative
    bg-transparent 
    border border-gray-400 dark:border-gray-600 
    text-gray-600 dark:text-gray-300
    px-10 py-3 rounded-full mt-6 
    font-medium text-sm uppercase tracking-wide
    transition-all duration-300 ease-in-out
    
    /* Hover State */
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
