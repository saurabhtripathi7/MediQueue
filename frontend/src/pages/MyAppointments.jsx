import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";

/**
 * COMPONENT: MyAppointments
 * ==============================================================================
 * RESPONSIBILITY:
 * - Acts as the Single Source UI for a user's appointment lifecycle.
 * - Displays active (upcoming) and historical (completed/cancelled) appointments.
 * - Handles destructive actions (cancel) using PESSIMISTIC updates.
 * - Integrates Razorpay for secure online payments.
 *
 * ARCHITECTURAL PRINCIPLES FOLLOWED:
 * ------------------------------------------------------------------------------
 * 1. Single Source of Truth (SSOT):
 *    - Backend is always the authority.
 *    - UI is NEVER updated optimistically.
 *
 * 2. Pessimistic Mutations:
 *    - Cancel / Payment actions only update UI after server confirmation.
 *
 * 3. Race Condition Safety:
 *    - Per-appointment locks (payingId, cancellingId).
 *
 * 4. Financial Safety:
 *    - Payment amount & verification handled strictly on server.
 */
const MyAppointments = () => {
  /**
   * GLOBAL CONTEXT
   * ----------------------------------------------------------------------------
   * currencySymbol is global configuration data.
   * Keeping this in context avoids hardcoding ₹ / $ and enables localization.
   */
  const { currencySymbol } = useContext(AppContext);

  /**
   * CORE UI STATE
   * ----------------------------------------------------------------------------
   * appointments:
   *   - Raw list fetched from backend.
   *   - Never manually mutated (SSOT principle).
   *
   * loading:
   *   - Prevents "Flash of Empty State" while data is being fetched.
   *
   * activeTab:
   *   - UI-only state to toggle between Active and History views.
   */
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  /**
   * CANCELLATION FLOW STATE
   * ----------------------------------------------------------------------------
   * showConfirm:
   *   - Controls visibility of confirmation modal.
   *
   * selectedAppointmentId:
   *   - Tracks which appointment user intends to cancel.
   *   - Required so modal remains stateless and reusable.
   *
   * cancellingId:
   *   - Acts as a PER-ITEM LOCK.
   *   - Prevents double-clicks and concurrent cancel requests.
   *   - Only disables the button for the appointment being cancelled.
   */
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  /**
   * PAYMENT FLOW STATE
   * ----------------------------------------------------------------------------
   * payingId:
   *   - Tracks which appointment is currently in payment flow.
   *   - Prevents:
   *       • Multiple Razorpay windows
   *       • Duplicate orders
   *       • Accidental double payments
   */
  const [payingId, setPayingId] = useState(null);

  /**
   * HELPER: formatDate
   * ----------------------------------------------------------------------------
   * Converts ISO date string to human-readable format.
   * Pure function → no side effects → easy to test.
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
   * Fetches appointments and performs CLIENT-SIDE SORTING.
   *
   * SORTING LOGIC (Business Driven):
   *  Priority Order:
   *   1. Upcoming (not cancelled, not completed)
   *   2. Completed
   *   3. Cancelled
   *
   *  Ordering:
   *   - Upcoming → earliest first
   *   - History  → latest first
   */
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/user/appointments");

      if (res.data.success) {
        const sortedAppointments = res.data.appointments.sort((a, b) => {
          const getWeight = (apt) => {
            if (apt.cancelled) return 2;
            if (apt.isCompleted) return 1;
            return 0;
          };

          const weightA = getWeight(a);
          const weightB = getWeight(b);

          if (weightA !== weightB) return weightA - weightB;

          const dateA = new Date(a.slotDate);
          const dateB = new Date(b.slotDate);

          // Upcoming → earliest first
          if (weightA === 0) return dateA - dateB;

          // History → latest first
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
   * PESSIMISTIC UPDATE FLOW:
   *  1. Lock specific appointment (cancellingId)
   *  2. Call backend
   *  3. Show feedback
   *  4. Re-fetch appointments (SSOT)
   *  5. Unlock
   */
  const cancelAppointment = async (appointmentId) => {
    try {
      setCancellingId(appointmentId);

      const res = await api.post("/user/cancel-appointment", {
        appointmentId,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        fetchAppointments();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCancellingId(null);
    }
  };

  /**
   * API: handlePayment (RAZORPAY FLOW)
   * ----------------------------------------------------------------------------
   * COMPLETE PAYMENT LIFECYCLE:
   *
   * PHASE 1 → Create Order (Server)
   * PHASE 2 → Open Razorpay Checkout (Client)
   * PHASE 3 → Receive Payment Callback (Client)
   * PHASE 4 → Verify Signature (Server)
   * PHASE 5 → Sync UI with Backend (SSOT)
   *
   * SECURITY NOTE:
   * - Client NEVER decides payment amount.
   * - Client NEVER trusts payment success without server verification.
   */
  const handlePayment = async (appointment) => {
    try {
      // Lock this appointment's payment button
      setPayingId(appointment._id);

      /**
       * PHASE 1: Create Razorpay Order (Server-Side)
       * ------------------------------------------------
       * Server:
       *  - Validates appointment
       *  - Determines amount
       *  - Creates Razorpay order using SECRET KEY
       */
      const res = await api.post("/user/payment-razorpay", {
        appointmentId: appointment._id,
      });

      if (!res.data.success) {
        toast.error("Payment initiation failed");
        return;
      }

      const { order } = res.data;

      /**
       * PHASE 2: Razorpay Checkout Configuration
       * ------------------------------------------------
       * Only PUBLIC key is exposed on client.
       */
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,

        /**
         * PHASE 3: Payment Callback (Client)
         * ------------------------------------------------
         * This DOES NOT mean payment is trusted yet.
         */
        handler: async function (response) {
          try {
            /**
             * PHASE 4: Payment Verification (Server)
             * ------------------------------------------------
             * Server:
             *  - Recomputes HMAC signature
             *  - Matches Razorpay secret
             *  - Confirms authenticity
             */
            const verifyRes = await api.post("/user/verify-razorpay", {
              ...response,
            });

            if (verifyRes.data.success) {
              toast.success("Payment successful");

              /**
               * PHASE 5: Re-sync UI with backend
               * ------------------------------------------------
               * Ensures payment status is authoritative.
               */
              fetchAppointments();
            }
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },

        /**
         * Handles user closing Razorpay modal manually.
         */
        modal: {
          ondismiss: function () {
            setPayingId(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Something went wrong with the payment gateway");
    } finally {
      // Safety reset to prevent UI deadlock
      setPayingId(null);
    }
  };

  /**
   * EFFECT: Initial Data Load
   * ----------------------------------------------------------------------------
   * Runs once on component mount.
   */
  useEffect(() => {
    fetchAppointments();
  }, []);

  /**
   * DERIVED DATA
   * ----------------------------------------------------------------------------
   * These are derived from `appointments` and not stored as state
   * to avoid duplication and inconsistencies.
   */
  const activeList = appointments.filter(
    (apt) => !apt.cancelled && !apt.isCompleted
  );
  const historyList = appointments.filter(
    (apt) => apt.cancelled || apt.isCompleted
  );

  const currentView = activeTab === "active" ? activeList : historyList;

  /**
   * LOADING STATE UI
   */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  /**
   * MAIN RENDER
   */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-20">
      {/* HEADER & TAB NAVIGATION */}
      {/* HEADER & TAB NAVIGATION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b dark:border-gray-700 pb-4 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          My Appointments
        </h2>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 sm:flex-none px-6 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "active"
                ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Active ({activeList.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 sm:flex-none px-6 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "history"
                ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            History ({historyList.length})
          </button>
        </div>
      </div>

      {/* APPOINTMENT LIST RENDER */}
      {currentView.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No {activeTab} appointments found.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {currentView.map((apt) => (
            <div
              key={apt._id}
              className={`group flex flex-col sm:flex-row items-center gap-6 p-6 bg-white dark:bg-gray-800 border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${
                apt.cancelled
                  ? "opacity-75 grayscale-[0.3]"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {/* DOCTOR IMAGE */}
              <div className="shrink-0">
                <img
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover bg-gray-100 dark:bg-gray-700"
                  src={apt.doctorId.image}
                  alt="doctor"
                />
              </div>

              {/* APPOINTMENT DETAILS */}
              <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                <p className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {apt.doctorId.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {apt.doctorId.speciality}
                </p>
                <div className="space-y-1 mt-2 text-sm text-gray-700 dark:text-gray-300">
                  <p className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                    <span className="font-semibold sm:w-24 text-gray-900 dark:text-gray-200 shrink-0">
                      Address:
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {apt.doctorId.address.line1}, {apt.doctorId.address.line2}
                    </span>
                  </p>
                  <p className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                    <span className="font-semibold sm:w-24 text-gray-900 dark:text-gray-200 shrink-0">
                      Timing:
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatDate(apt.slotDate)} | {apt.slotTime}
                    </span>
                  </p>
                  <p className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                    <span className="font-semibold sm:w-24 text-gray-900 dark:text-gray-200 shrink-0">
                      Fees:
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {currencySymbol}
                      {apt.doctorId.fees}
                    </span>
                  </p>
                </div>
              </div>

              {/* STATUS & ACTION BUTTONS */}
              <div className="flex flex-col gap-2 w-full sm:w-48 shrink-0">
                {apt.isCompleted && (
                  <div className="w-full py-2.5 text-center text-sm font-semibold text-green-600 bg-green-50 border border-green-100 rounded-lg">
                    Completed
                  </div>
                )}

                {apt.cancelled && (
                  <div
                    className={`w-full py-2.5 text-center text-sm font-semibold rounded-lg border ${
                      apt.payment
                        ? "text-orange-600 bg-orange-50 border-orange-100"
                        : "text-red-600 bg-red-50 border-red-100"
                    }`}
                  >
                    {apt.payment ? "Refund Initiated" : "Cancelled"}
                  </div>
                )}

                {!apt.cancelled && !apt.isCompleted && (
                  <div className="flex flex-col gap-2">
                    {
                      /*
                       * UI: Paid Status Badge
                       */
                      apt.payment ? (
                        <div className="flex items-center justify-center gap-2 w-full py-2 px-3 text-sm font-bold text-emerald-700 bg-emerald-100/50 border border-emerald-200 rounded-full shadow-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                          PAID
                        </div>
                      ) : (
                        <button
                          disabled={payingId === apt._id}
                          onClick={() => handlePayment(apt)}
                          className="w-full py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50"
                        >
                          {payingId === apt._id
                            ? "Processing..."
                            : "Pay Online"}
                        </button>
                      )
                    }

                    <button
                      disabled={cancellingId === apt._id}
                      onClick={() => {
                        setSelectedAppointmentId(apt._id);
                        setShowConfirm(true);
                      }}
                      className="w-full py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                    >
                      {cancellingId === apt._id
                        ? "Processing..."
                        : apt.payment
                        ? "Cancel & Get Refund"
                        : "Cancel Appointment"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Cancellation"
        message={
          selectedAppointmentId &&
          appointments.find((a) => a._id === selectedAppointmentId)?.payment
            ? "Since you've already paid, a refund will be initiated automatically."
            : "Are you sure you want to cancel this appointment?"
        }
        confirmText="Yes, Cancel"
        cancelText="Back"
        isLoading={cancellingId === selectedAppointmentId}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          cancelAppointment(selectedAppointmentId);
          setShowConfirm(false);
        }}
      />
    </div>
  );
};

export default MyAppointments;
