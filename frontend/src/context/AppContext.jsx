import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "₹";
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);

  // Fetch doctors list
  const getDoctorsData = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/api/doctor/list`
      );

      const data = response.data;

      if (data.success) {
        setDoctors(data.doctors); // store fetched doctors list in state 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch doctors"
      );
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const value = {
    doctors,
    currencySymbol,
    getDoctorsData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
