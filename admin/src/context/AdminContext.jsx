import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// 1. Create the specific Admin Context
export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || null
  );

  const [doctors, setDoctors] = useState([]);

  const saveAdminToken = (token) => {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
    toast.info("Logged out successfully");
  };

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all doctors function
  const getAllDoctors = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/admin/all-doctors`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      console.log(response.data); // DEBUG once
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to fetch doctors");
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []); // runs once on mount

  //API to change availability
  const changeAvailability = async (docId) => {
    try {
      const response = await axios.patch(
        `${backendURL}/api/admin/change-availability/${docId}`,
        {}, // body (empty)
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success(data.message);
        getAllDoctors(); // refresh list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const value = {
    adminToken,
    saveAdminToken,
    backendURL,
    logoutAdmin,
    doctors,
    getAllDoctors,
    changeAvailability,
  };

  // 2. Wrap children with the Admin Provider
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;
