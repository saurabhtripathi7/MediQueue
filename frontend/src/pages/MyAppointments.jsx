import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";

/**
 * COMPONENT: MyAppointments
 * ==============================================================================
 * RESPONSIBILITY:
 * - Displays user's medical appointment history.
 * - Handles "Cancel" actions with pessimistic updates (server-first).
 * - Sorts data client-side (Upcoming > Completed > Cancelled).
 * * CRITICAL ARCHITECTURE NOTE:
 * - This component relies on the "Single Source of Truth" pattern.
 * - We NEVER update the UI optimistically (removing a card before server confirms).
 * - We always re-fetch data after a mutation to ensure sync with backend.
 */
const MyAppointments = () => {
  const { currencySymbol } = useContext(AppContext);

  /**
   * STATE: Data & UI Control
   * ----------------------------------------------------------------------------
   * appointments: The raw array from the backend.
   * loading:      Prevents "Flash of Empty Content" (showing 'No appointments' while fetching).
   */
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * STATE: Cancellation Flow & Race Condition Guards
   * ----------------------------------------------------------------------------
   * showConfirm:           Controls modal visibility.
   * selectedAppointmentId: Tracks which item the user *intends* to cancel.
   * cancellingId:          Tracks the item *currently being* cancelled via API.
   * * WHY 'cancellingId'? 
   * - Prevents the user from double-clicking the button.
   * - Disables the specific button during the API call to avoid race conditions.
   */
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  /**
   * HELPER: Date Formatting
   * Converts ISO string to readable "1 Jan 2026" format.
   */
  const formatDate = (slotDate) => {
    if (!slotDate) return "";
    const dateObj = new Date(slotDate);
    return dateObj.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /**
   * API: fetchAppointments
   * ----------------------------------------------------------------------------
   * Fetches and SORTS the data.
   * * SORTING LOGIC EXPLAINED:
   * 1. Priority Groups: Upcoming (0) -> Completed (1) -> Cancelled (2).
   * 2. Date Sort:
   * - If Upcoming: Ascending (Soonest date first).
   * - If Past: Descending (Newest history first).
   */
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/appointments");

      if (res.data.success) {
        // --- CLIENT-SIDE SORTING ---
        const sortedAppointments = res.data.appointments.sort((a, b) => {
          // 1. Assign Weight by Status
          const getWeight = (apt) => {
            if (apt.cancelled) return 2; // Bottom
            if (apt.isCompleted) return 1; // Middle
            return 0; // Top (Upcoming)
          };

          const weightA = getWeight(a);
          const weightB = getWeight(b);

          // 2. Sort by Weight
          if (weightA !== weightB) {
            return weightA - weightB;
          }

          // 3. Sort by Date within Weight Class
          const dateA = new Date(a.slotDate);
          const dateB = new Date(b.slotDate);

          // If Upcoming: Show Nearest date first (Ascending)
          if (weightA === 0) {
            return dateA - dateB;
          }
          
          // If History: Show Latest date first (Descending)
          return dateB - dateA;
        });

        setAppointments(sortedAppointments);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * API: cancelAppointment
   * ----------------------------------------------------------------------------
   * Sends cancel request -> Waits for success -> Re-fetches list.
   * * WHY RE-FETCH? (Pessimistic Update)
   * - If we just filtered the list locally, the user might see the item disappear
   * even if the server failed to process the request (e.g., Internet lost).
   * - Re-fetching guarantees the UI reflects the REAL server state (fees, refunds, etc).
   */
  const cancelAppointment = async (appointmentId) => {
    try {
      setCancellingId(appointmentId); // Lock UI
      const res = await api.post("/user/cancel-appointment", { appointmentId });
      
      if (res.data.success) {
        toast.success(res.data.message);
        fetchAppointments(); // Update UI with authoritative data
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCancellingId(null); // Unlock UI
    }
  };

  /**
   * LIFECYCLE: Mount
   * ----------------------------------------------------------------------------
   * Runs ONCE when component mounts.
   * * DEPENDENCY ARRAY: [] (Empty)
   * - Why? We only want the initial data load on page visit.
   * - DANGER: If you add [appointments] here, it will cause an INFINITE LOOP 
   * (Fetch -> State Update -> Re-render -> Fetch -> ...)
   */
  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-20">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 border-b dark:border-gray-700 pb-4">
        My Appointments
      </h2>

      {appointments.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No appointments booked yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {appointments.map((apt) => {
            const doc = apt.doctorId;

            return (
              <div
                key={apt._id}
                className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 
                           bg-white dark:bg-gray-800 
                           border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300
                           ${
                             apt.cancelled
                               ? "border-red-100 dark:border-red-900/30 opacity-75 grayscale-[0.3]" 
                               : "border-gray-200 dark:border-gray-700"
                           }
                           `}
              >
                {/* Doctor Image */}
                <div className="shrink-0">
                  <img
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover bg-gray-100 dark:bg-gray-700"
                    src={doc.image}
                    alt={doc.name}
                  />
                </div>

                {/* Appointment Details */}
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {doc.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {doc.speciality}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 mt-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span className="font-semibold w-24 text-gray-900 dark:text-gray-200">
                        Address:
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {doc.address.line1}, {doc.address.line2}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span className="font-semibold w-24 text-gray-900 dark:text-gray-200">
                        Date & Time:
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatDate(apt.slotDate)} | {apt.slotTime}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span className="font-semibold w-24 text-gray-900 dark:text-gray-200">
                        Fees:
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {currencySymbol}
                        {doc.fees}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Status & Actions Column */}
                <div className="flex flex-col gap-3 w-full sm:w-auto items-end mt-4 sm:mt-0">
                  {/* Status Badges - 'self-start' ensures alignment above buttons */}
                  {!apt.cancelled && !apt.isCompleted && (
                    <span className="self-start px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-800">
                      Upcoming
                    </span>
                  )}
                  {apt.isCompleted && (
                    <span className="self-start px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-full border border-green-100 dark:border-green-800">
                      Completed
                    </span>
                  )}
                  {apt.cancelled && (
                    <span className="self-start px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-full border border-red-100 dark:border-red-800">
                      Cancelled
                    </span>
                  )}

                  <div className="flex gap-2 w-full sm:w-auto">
                    {!apt.cancelled && !apt.isCompleted && (
                      <>
                        {!apt.payment && (
                          <button className="flex-1 sm:flex-none px-6 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                            Pay Online
                          </button>
                        )}

                        {/* CANCEL BUTTON
                          - Uses '!bg-red-600' to override global dark mode styles.
                          - Disabled state handled by 'cancellingId' check.
                        */}
                        <button
                          disabled={cancellingId === apt._id}
                          onClick={() => {
                            setSelectedAppointmentId(apt._id);
                            setShowConfirm(true);
                          }}
                          className="flex-1 sm:flex-none px-6 py-2 text-sm font-medium rounded transition-all duration-300 
                                     text-gray-600 dark:text-gray-300 
                                     bg-white dark:bg-gray-800 
                                     border border-gray-200 dark:border-gray-600 
                                     hover:bg-red-600! hover:text-white! hover:border-red-600!
                                     disabled:opacity-50"
                        >
                          {cancellingId === apt._id
                            ? "Processing..."
                            : "Cancel"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONFIRM MODAL 
        - Decouples user click from API call.
        - Prevents accidental cancellations.
      */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment?"
        confirmText="Yes, Cancel"
        cancelText="Back"
        isLoading={cancellingId === selectedAppointmentId}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedAppointmentId(null);
        }}
        onConfirm={() => {
          cancelAppointment(selectedAppointmentId);
          setShowConfirm(false);
        }}
      />
    </div>
  );
};

export default MyAppointments;