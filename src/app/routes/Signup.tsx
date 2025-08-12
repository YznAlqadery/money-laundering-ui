import { useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      const userData = {
        username: data.username,
        role: data.role,
      };

      login(userData, data.token);
      setUsername("");
      setPassword("");
      navigate("/");
    } else {
      alert(data.message);
    }
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 sm:no-scrollbar overflow-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Signup</h1>
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
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
