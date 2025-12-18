import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const MyAppointments = () => {
  const { doctors, currencySymbol } = useContext(AppContext);

  // ---------- MOCK APPOINTMENTS ----------
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

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // ---------- FORMAT DATE ----------
  const formatDate = (slotDate) => {
    const [day, month, year] = slotDate.split("_");
    return `${day} ${months[Number(month)]} ${year}`;
  };

  // ---------- CANCEL APPOINTMENT ----------
  const cancelAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt._id === id ? { ...apt, cancelled: true } : apt
      )
    );
  };

  return (
    <div className="px-3 sm:px-8 md:px-16 mt-12">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 border-b pb-3">
        My Appointments
      </h2>

      {appointments.length === 0 && (
        <p className="dark:text-white text-gray-500 text-center">No appointments found.</p>
      )}

      <div className="flex flex-col gap-6">
        {appointments.map((apt) => {
          const doc = doctors.find((d) => d._id === apt.doctorId);
          if (!doc) return null;

          return (
            <div
              key={apt._id}
              className="flex flex-col sm:flex-row gap-4 border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              {/* Doctor Image */}
              <img
                src={doc.image}
                alt={doc.name}
                className="w-32 h-32 object-contain bg-blue-50 rounded-lg"
              />

              {/* Doctor Info */}
              <div className="flex-1 text-sm text-gray-600">
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {doc.name}
                </p>
                <p>{doc.speciality}</p>

                <p className="mt-2 font-medium text-gray-700">Address:</p>
                <p className="text-xs">{doc.address.line1}</p>
                <p className="text-xs">{doc.address.line2}</p>

                <p className="mt-2">
                  <span className="font-medium text-gray-700">
                    Date & Time:
                  </span>{" "}
                  {formatDate(apt.slotDate)} | {apt.slotTime}
                </p>

                <p className="mt-1">
                  <span className="font-medium text-gray-700">
                    Fees:
                  </span>{" "}
                  {currencySymbol}
                  {doc.fees}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 justify-end min-w-45">
                {!apt.cancelled && !apt.isCompleted && (
                  <>
                    <button className="py-2 border rounded text-sm hover:bg-primary hover:text-white transition">
                      Pay Online
                    </button>
                    <button
                      onClick={() => cancelAppointment(apt._id)}
                      className="py-2 border rounded text-sm hover:bg-red-600 hover:text-white transition"
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}

                {apt.cancelled && (
                  <button className="py-2 border border-red-500 text-red-500 rounded text-sm">
                    Appointment Cancelled
                  </button>
                )}

                {apt.isCompleted && (
                  <button className="py-2 border border-green-500 text-green-500 rounded text-sm">
                    Completed
                  </button>
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
