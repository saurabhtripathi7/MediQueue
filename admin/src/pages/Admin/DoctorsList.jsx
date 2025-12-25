import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, adminToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);

  useEffect(() => {
    if (adminToken) {
      getAllDoctors();
    }
  }, [adminToken]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll custom-scrollbar">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">All Doctors</h1>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {doctors.length} Doctors
        </span>
      </div>
      
      {/* Grid Layout for better responsiveness */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6">
        {doctors.length > 0 ? (
          doctors.map((item, index) => (
            <div
              className="bg-white border border-indigo-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 group"
              key={index}
            >
              {/* Image Section */}
              <div className="relative overflow-hidden bg-indigo-50 group-hover:bg-indigo-600 transition-colors duration-500">
                <img
                  className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  src={item.image}
                  alt={item.name}
                />
              </div>

              {/* Content Section */}
              <div className="p-5">
                <p className="text-neutral-800 text-lg font-semibold truncate">
                  {item.name}
                </p>
                <p className="text-zinc-500 text-sm mb-4">{item.speciality}</p>

                {/* Custom Toggle Switch for Availability */}
                <div className="flex items-center gap-2 text-sm mt-auto">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      onChange={() => changeAvailability(item._id)}
                      type="checkbox"
                      checked={item.available}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                  <span
                    className={`font-medium ${
                      item.available ? "text-emerald-500" : "text-gray-400"
                    }`}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Empty State
          <div className="col-span-full text-center py-20 text-gray-400">
            <p>No doctors found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;