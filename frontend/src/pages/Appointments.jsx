import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import api from "../api/axiosInstance";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";

const Appointment = () => {
  /* ======================================================
     ROUTER & CONTEXT
     ====================================================== */
  const { doctorId } = useParams(); // ✅ FIXED
  const navigate = useNavigate();

  const {
    doctors,
    currencySymbol,
    getDoctorsData,
  } = useContext(AppContext);

  /* ======================================================
     LOCAL STATE
     ====================================================== */
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  /* ======================================================
     1️⃣ REFRESH DOCTOR DATA ON PAGE ENTRY
     ====================================================== */
  useEffect(() => {
    getDoctorsData();
  }, [doctorId]);

  /* ======================================================
     FETCH DOCTOR INFO FROM CONTEXT
     ====================================================== */
  useEffect(() => {
    const info = doctors.find((doc) => doc._id === doctorId);
    setDocInfo(info || null);
  }, [doctors, doctorId]);

  /* ======================================================
     HELPER: GET BOOKED SLOTS FOR A DATE
     ====================================================== */
  const getBookedSlotsForDate = (dateStr) => {
    if (!docInfo?.slots_booked) return [];
    return docInfo.slots_booked[dateStr] || [];
  };

  /* ======================================================
     GENERATE SLOTS (UI ONLY)
     ====================================================== */
  useEffect(() => {
    if (!docInfo) return;

    const generateSlots = () => {
      const today = new Date();
      const slotsArr = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        const endTime = new Date(currentDate);
        endTime.setHours(21, 0, 0, 0);

        if (today.toDateString() === currentDate.toDateString()) {
          currentDate.setHours(
            currentDate.getHours() >= 10
              ? currentDate.getHours() + 1
              : 10
          );
          currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        } else {
          currentDate.setHours(10, 0, 0, 0);
        }

        const daySlots = [];

        while (currentDate < endTime) {
          const formattedTime = currentDate
            .toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
            .toUpperCase()
            .trim();

          daySlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });

          currentDate.setMinutes(currentDate.getMinutes() + 30);
        }

        slotsArr.push(daySlots);
      }

      setDocSlots(slotsArr);
    };

    generateSlots();
  }, [docInfo]);

  /* ======================================================
     2️⃣ BOOK APPOINTMENT
     ====================================================== */
  const bookAppointmentHandler = async () => {
    try {
      if (!slotTime) return;

      const slotDate = docSlots[slotIndex][0].datetime
        .toISOString()
        .split("T")[0];

      const slotTimeToSend = slotTime.trim().toUpperCase();

      const { data } = await api.post("/user/book-appointment", {
        doctorId, // ✅ FIXED
        slotDate,
        slotTime: slotTimeToSend,
      });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      // Optimistic UI update
      setDocInfo((prev) => ({
        ...prev,
        slots_booked: {
          ...prev.slots_booked,
          [slotDate]: [
            ...(prev.slots_booked?.[slotDate] || []),
            slotTimeToSend,
          ],
        },
      }));

      toast.success("Appointment booked successfully!");
      navigate("/my-appointments");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    }
  };

  if (!docInfo) return null;

  /* ======================================================
     UI
     ====================================================== */
  return (
    <div>
      {/* ---------------- DOCTOR DETAILS ---------------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <img
          className="bg-secondary w-full sm:max-w-72 rounded-lg"
          src={docInfo.image}
          alt={docInfo.name}
        />

        <div className="flex-1 border rounded-lg p-8 bg-white">
          <p className="flex items-center gap-2 text-2xl font-medium">
            {docInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="" />
          </p>

          <div className="flex gap-2 text-sm text-gray-600 mt-1">
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <span className="border px-2 rounded-full text-xs">
              {docInfo.experience}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-3">{docInfo.about}</p>

          <p className="text-gray-500 font-medium mt-4">
            Appointment fee:
            <span className="font-bold ml-2">
              {currencySymbol}
              {docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* ---------------- BOOKING SLOTS ---------------- */}
      <div className="sm:ml-72 mt-6">
        <p className="font-medium text-gray-700">Booking slots</p>

        {/* -------- Days -------- */}
        <div className="flex gap-3 overflow-x-auto mt-4">
          {docSlots.map(
            (item, index) =>
              item.length > 0 && (
                <div
                  key={index}
                  onClick={() => {
                    setSlotIndex(index);
                    setSlotTime("");
                  }}
                  className={`min-w-16 py-5 text-center rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-secondary text-white"
                      : "border"
                  }`}
                >
                  <p>{daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0].datetime.getDate()}</p>
                </div>
              )
          )}
        </div>

        {/* -------- Time Slots -------- */}
        <div className="flex gap-3 overflow-x-auto mt-4">
          {docSlots[slotIndex]?.length ? (
            (() => {
              const slotDate = docSlots[slotIndex][0].datetime
                .toISOString()
                .split("T")[0];

              const bookedSlots = getBookedSlotsForDate(slotDate);

              return docSlots[slotIndex].map((item, index) => {
                const isBooked = bookedSlots.includes(item.time);

                return (
                  <p
                    key={index}
                    onClick={() => !isBooked && setSlotTime(item.time)}
                    className={`px-5 py-2 rounded-full text-sm
                      ${
                        isBooked
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed line-through"
                          : slotTime === item.time
                          ? "bg-secondary text-white cursor-pointer"
                          : "border text-gray-400 cursor-pointer"
                      }
                    `}
                  >
                    {item.time.toLowerCase()}
                  </p>
                );
              });
            })()
          ) : (
            <p className="text-gray-400">No slots available</p>
          )}
        </div>

        {/* -------- Book Button -------- */}
        <button
          onClick={bookAppointmentHandler}
          disabled={!slotTime}
          className={`px-14 py-3 rounded-full mt-6 ${
            slotTime
              ? "bg-secondary text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Book an appointment
        </button>
      </div>

      {/* ---------------- RELATED DOCTORS ---------------- */}
      <RelatedDoctors
        doctorId={doctorId} // ✅ FIXED
        speciality={docInfo.speciality}
      />
    </div>
  );
};

export default Appointment;
