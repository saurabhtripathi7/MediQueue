import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [relDocs, setRelDocs] = useState([]);

  useEffect(() => {
    if (doctors?.length && speciality) {
      const filtered = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDocs(filtered);
    }
  }, [doctors, speciality, docId]);

  if (!relDocs.length) return null;

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 dark:text-gray-50 md:mx-10">
      <h1 className="text-3xl font-medium">Related Doctors</h1>

      <p className="sm:w-1/3 text-center text-sm">
        Doctors with the same speciality you may be interested in
      </p>

      {/* GRID */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5 px-3 sm:px-0">
        {relDocs.slice(0, 4).map((item) => {
          const isAvailable = item.available ?? true;

          return (
            <div
              key={item._id}
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="border border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-3 transition-all duration-300"
            >
              <img
  className="bg-blue-50 dark:bg-gray-700 h-36 w-full object-contain"
  src={item.image}
  alt={item.name}
/>


              <div className="p-4">
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

                <p className="text-gray-900 dark:text-white text-lg font-medium">
                  {item.name}
                </p>

                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.speciality}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedDoctors;
