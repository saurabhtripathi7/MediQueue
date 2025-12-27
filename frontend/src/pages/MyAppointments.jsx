import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

/**
 * MyAppointments
 * ----------------
 * - Fetches logged-in user's appointments
 * - Relies on backend `populate("doctorId")`
 * - Formats ISO dates safely for UI
 * - Handles loading, empty, cancelled & completed states
 */
const MyAppointments = () => {
  const { currencySymbol } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Format ISO date (YYYY-MM-DD) to human-readable format
   */
  const formatDate = (slotDate) => {
    if (!slotDate) return "";

    const dateObj = new Date(slotDate);
    if (isNaN(dateObj.getTime())) return slotDate;

    return dateObj.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /**
   * Fetch appointments for logged-in user
   */
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/user/appointments");

      if (!res.data?.success) {
        toast.error(res.data?.message || "Failed to fetch appointments");
        return;
      }

      setAppointments(res.data.appointments || []);
    } catch (error) {
      console.error("Fetch appointments error:", error);
      toast.error("Unable to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  /* =========================
     UI STATES
     ========================= */

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-20">
        Loading appointments...
      </p>
    );
  }

  if (!loading && appointments.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-20">
        No appointments found.
      </p>
    );
  }

  /* =========================
     RENDER APPOINTMENTS
     ========================= */

  return (
    <div className="px-3 sm:px-8 md:px-16 mt-12">
      <h2 className="text-xl font-semibold mb-6 border-b pb-3">
        My Appointments
      </h2>

      <div className="flex flex-col gap-6">
        {appointments.map((apt) => {
          const doc = apt.doctorId; // populated doctor object

          return (
            <div
              key={apt._id}
              className="flex flex-col sm:flex-row gap-4 border rounded-xl p-4 shadow-sm hover:shadow-lg transition bg-white"
            >
              {/* Doctor Image */}
              <div className="w-32 h-32 shrink-0">
                {doc?.image ? (
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg text-sm text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              {/* Appointment Details */}
              <div className="flex-1 text-sm text-gray-600 dark:text-white">
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {doc?.name || "Unknown Doctor"}
                </p>
                <p className="text-gray-500">{doc?.speciality}</p>

                <p className="mt-2 font-medium text-gray-700">Address:</p>
                <p className="text-xs text-gray-500">{doc?.address?.line1}</p>
                <p className="text-xs text-gray-500">{doc?.address?.line2}</p>

                <p className="mt-2">
                  <span className="font-medium">Date & Time:</span>{" "}
                  {formatDate(apt.slotDate)} | {apt.slotTime}
                </p>

                <p className="mt-1">
                  <span className="font-medium">Fees:</span>{" "}
                  {currencySymbol}
                  {doc?.fees}
                </p>
              </div>

              {/* Status / Actions */}
              <div className="flex flex-col gap-2 justify-end sm:min-w-48">
                {!apt.cancelled && !apt.isCompleted && (
                  <>
                    <button className="py-2 border rounded text-sm hover:bg-primary hover:text-white transition">
                      Pay Online
                    </button>

                    <button
                      onClick={() =>
                        setAppointments((prev) =>
                          prev.map((x) =>
                            x._id === apt._id
                              ? { ...x, cancelled: true }
                              : x
                          )
                        )
                      }
                      className="py-2 border rounded text-sm hover:bg-red-500 hover:text-white transition"
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}

                {apt.cancelled && (
                  <div className="py-2 border border-red-500 text-red-500 rounded text-center text-sm font-medium">
                    Appointment Cancelled
                  </div>
                )}

                {apt.isCompleted && (
                  <div className="py-2 border border-green-500 text-green-500 rounded text-center text-sm font-medium">
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
