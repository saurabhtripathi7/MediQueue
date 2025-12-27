// backend/utils/convertTo24Hr.js
export const convertTo24Hr = (time) => {
  if (!time) return null;
  const s = String(time).trim();

  // Try AM/PM formats first (with or without space)
  const ampmRegex = /^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/;
  const ampmMatch = s.match(ampmRegex);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const mod = ampmMatch[3].toUpperCase();

    if (isNaN(hours) || isNaN(minutes)) return null;
    if (minutes < 0 || minutes > 59) return null;
    if (hours < 1 || hours > 12) return null;

    if (mod === "PM" && hours !== 12) hours += 12;
    if (mod === "AM" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  // Try plain 24-hour format like "14:30" or "9:30"
  const plainRegex = /^(\d{1,2}):(\d{2})$/;
  const plainMatch = s.match(plainRegex);
  if (plainMatch) {
    const hours = parseInt(plainMatch[1], 10);
    const minutes = parseInt(plainMatch[2], 10);

    if (isNaN(hours) || isNaN(minutes)) return null;
    if (hours < 0 || hours > 23) return null;
    if (minutes < 0 || minutes > 59) return null;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  // Not recognized
  return null;
};
