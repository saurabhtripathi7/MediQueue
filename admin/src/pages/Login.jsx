import { useState, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const Login = () => {
  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { saveAdminToken, backendURL } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (role === "Admin") {
        const response = await axios.post(`${backendURL}/api/admin/login`, {
          email,
          password,
        });

        if (response.data.success) {
          saveAdminToken(response.data.token);
          toast.success("Login successful");
        } else {
          toast.error(response.data.message || "Login failed");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-85 sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{role}</span> Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white w-full px-4 py-2 rounded-md border hover:bg-blue-600 hover:text-white transition mt-2 hover:shadow-md hover:scale-105"
        >
          Login
        </button>

        {role === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              className="text-blue-700 underline cursor-pointer"
              onClick={() => setRole("Doctor")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              className="text-blue-700 underline cursor-pointer"
              onClick={() => setRole("Admin")}
            >
            Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
