import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currency = "₹";

  // Month mapping (1-based index)
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

  /**
   * Formats date coming from backend
   * Backend format: YYYY-MM-DD
   * Output: DD Mon YYYY
   */
  const slotDateFormat = (slotDate) => {
    if (!slotDate) return "—";

    const [year, month, day] = slotDate.split("-");
    return `${day} ${months[Number(month)]} ${year}`;
  };

  /**
   * Calculates age safely
   * Returns "—" if DOB is missing 
   */
  const calculateAge = (dob) => {
    if (!dob) return "—";

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const value = {
    currency,
    slotDateFormat,
    calculateAge,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
