import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const { doctors, currencySymbol } = useContext(AppContext);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  /* -------------------- Fetch Doctor Info -------------------- */
  useEffect(() => {
    const info = doctors.find((doc) => doc._id === docId);
    setDocInfo(info || null);
  }, [doctors, docId]);

  /* -------------------- Generate Slots (Frontend Only) -------------------- */
  useEffect(() => {
    if (!docInfo) return;

    const generateSlots = () => {
      let today = new Date();
      let slotsArr = [];

      for (let i = 0; i < 7; i++) {
        let currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        let endTime = new Date(currentDate);
        endTime.setHours(21, 0, 0, 0); // 9 PM

        // Handle today vs future days
        if (today.getDate() === currentDate.getDate()) {
          currentDate.setHours(
            currentDate.getHours() >= 10 ? currentDate.getHours() + 1 : 10
          );
          currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        } else {
          currentDate.setHours(10, 0, 0, 0);
        }

        let daySlots = [];

        while (currentDate < endTime) {
          daySlots.push({
            datetime: new Date(currentDate),
            time: currentDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });

          currentDate.setMinutes(currentDate.getMinutes() + 30);
        }

        slotsArr.push(daySlots);
      }

      setDocSlots(slotsArr);
    };

    generateSlots();
  }, [docInfo]);

  if (!docInfo) return null;

  return (
    <div>
      {/* -------------------- Doctor Details -------------------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <img
          className="bg-secondary w-full sm:max-w-72 rounded-lg"
          src={docInfo.image}
          alt={docInfo.name}
        />

        <div className="flex-1 border border-gray-400 rounded-lg p-8 bg-white">
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

          <p className="text-gray-500 dark:text-gray-300 font-medium mt-4">
            Appointment fee: {/* Add 'font-bold' here */}
            <span className="text-gray-600 dark:text-white font-bold">
              {currencySymbol}
              {docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* -------------------- Booking Slots -------------------- */}
      <div className="sm:ml-72 mt-6">
        <p className="font-medium text-gray-700">Booking slots</p>

        {/* Days */}
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
                      : "border border-gray-300"
                  }`}
                >
                  <p>{daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0].datetime.getDate()}</p>
                </div>
              )
          )}
        </div>

        {/* Time Slots */}
        <div className="flex gap-3 overflow-x-auto mt-4">
          {docSlots[slotIndex]?.length ? (
            docSlots[slotIndex].map((item, index) => (
              <p
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`px-5 py-2 rounded-full cursor-pointer text-sm ${
                  slotTime === item.time
                    ? "bg-secondary text-white"
                    : "border text-gray-400"
                }`}
              >
                {item.time.toLowerCase()}
              </p>
            ))
          ) : (
            <p className="text-gray-400">No slots available</p>
          )}
        </div>

        <button
          disabled={!slotTime}
          className={`hover:cursor-pointer px-14 py-3 rounded-full mt-6 ${
            slotTime
              ? "bg-secondary text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Book an appointment
        </button>
      </div>

      {/* -------------------- Related Doctors -------------------- */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
