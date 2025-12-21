import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const MyAppointments = () => {
  const { doctors, currencySymbol } = useContext(AppContext);

  const [appointments, setAppointments] = useState([
    {
      _id: "apt1",
      doctorId: "doc1",
      slotDate: "12_10_2025",
      slotTime: "10:30 AM",
      cancelled: false,
      isCompleted: false,
    },
    {
      _id: "apt2",
      doctorId: "doc4",
      slotDate: "05_09_2025",
      slotTime: "04:00 PM",
      cancelled: false,
      isCompleted: true,
    },
    {
      _id: "apt3",
      doctorId: "doc7",
      slotDate: "01_09_2025",
      slotTime: "11:00 AM",
      cancelled: true,
      isCompleted: false,
    },
  ]);

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const formatDate = (slotDate) => {
    const [day, month, year] = slotDate.split("_");
    return `${day} ${months[Number(month)]} ${year}`;
  };

  const cancelAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt._id === id ? { ...apt, cancelled: true } : apt))
    );
  };

  return (
    <div className="px-3 sm:px-8 md:px-16 mt-12">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 border-b dark:border-gray-700 pb-3">
        My Appointments
      </h2>

      {appointments.length === 0 && (
        <p className="dark:text-gray-400 text-gray-500 text-center mt-10">No appointments found.</p>
      )}

      <div className="flex flex-col gap-6">
        {appointments.map((apt) => {
          const doc = doctors.find((d) => d._id === apt.doctorId);
          if (!doc) return null;

          return (
            <div
              key={apt._id}
              // FIX: Added dark borders and background
              className="flex flex-col sm:flex-row gap-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800/50"
            >
              {/* Doctor Image */}
              <div className="w-32 h-32 shrink-0">
                <img
                  src={doc.image}
                  alt={doc.name}
                  // FIX: Changed bg-blue-50 to work in dark mode
                  className="w-full h-full object-cover bg-blue-50 dark:bg-gray-700 rounded-lg"
                />
              </div>

              {/* Doctor Info */}
              <div className="flex-1 text-sm text-gray-600 dark:text-gray-300">
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {doc.name}
                </p>
                <p className="text-gray-500 dark:text-gray-400">{doc.speciality}</p>

                <p className="mt-2 font-medium text-gray-700 dark:text-gray-200">Address:</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{doc.address.line1}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{doc.address.line2}</p>

                <p className="mt-2">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    Date & Time:
                  </span>{" "}
                  <span className="text-gray-600 dark:text-gray-300">
                     {formatDate(apt.slotDate)} | {apt.slotTime}
                  </span>
                </p>

                <p className="mt-1">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    Fees:
                  </span>{" "}
                  <span className="text-gray-600 dark:text-gray-300">
                    {currencySymbol}{doc.fees}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 justify-end sm:min-w-48">
                {!apt.cancelled && !apt.isCompleted && (
                  <>
                    <button className="py-2 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white hover:border-primary dark:hover:border-primary transition-all duration-300">
                      Pay Online
                    </button>
                    <button
                      onClick={() => cancelAppointment(apt._id)}
                      className="py-2 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white hover:border-red-500 dark:hover:border-red-500 transition-all duration-300"
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}

                {apt.cancelled && (
                  <div className="py-2 border border-red-500 text-red-500 rounded text-center text-sm font-medium opacity-80">
                    Appointment Cancelled
                  </div>
                )}

                {apt.isCompleted && (
                  <div className="py-2 border border-green-500 text-green-500 rounded text-center text-sm font-medium opacity-80">
                    Completed
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAppointments;