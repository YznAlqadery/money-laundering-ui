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
        console.log(data.role);
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
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 sm:no-scrollbar overflow-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Login</h1>
        <form
          className="bg-white shadow-md rounded-lg p-8 max-w-md w-full"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="username"
            className="block text-gray-700 font-semibold mb-2"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full border border-gray-300 rounded-md p-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label
            htmlFor="password"
            className="block text-gray-700 font-semibold mb-2"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full border border-gray-300 rounded-md p-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="submit"
            value="Submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
          />

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
