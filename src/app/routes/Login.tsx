import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, token, user } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) {
      if (user?.role?.toString().trim().toUpperCase() === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/fraud-cycles");
      }
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        login({ username: data.username, role: data.role }, data.jwtToken);
        setUsername("");
        setPassword("");
        if (data.role?.toString().trim().toUpperCase() === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/fraud-cycles");
        }
      }
    } catch (error) {
      alert("Unable to connect to the server. Please try again." + error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-san-marino-200 via-san-marino-300 to-san-marino-400 font-poppins">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-san-marino-50 shadow-lg rounded-2xl p-8 sm:p-10 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-center text-san-marino-950 mb-6">
            Welcome Back
          </h1>

          {/* Username */}
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-san-marino-900 font-semibold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border border-san-marino-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-san-marino-600 transition"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-san-marino-900 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border border-san-marino-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-san-marino-600 transition"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-san-marino-600 text-san-marino-50 font-semibold py-3 rounded-lg hover:bg-san-marino-700 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
