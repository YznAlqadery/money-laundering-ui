import { useNavigate } from "react-router-dom";
import { useAuth } from "../app/context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        logout();
        navigate("/");
      }}
      className="bg-san-marino-300 text-san-marino-950 px-4 py-2 rounded-full text-lg font-medium hover:bg-san-marino-200 hover:cursor-pointer text-center  sm:px-8"
    >
      Logout
    </button>
  );
}
