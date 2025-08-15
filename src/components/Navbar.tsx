import { useAuth } from "../app/context/AuthContext";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const { token } = useAuth();
  return (
    <nav className="bg-san-marino-800 shadow-md font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="text-xl font-bold text-san-marino-50">
              FraudGuard
            </a>
          </div>

          {/* Desktop Menu */}
          {token && (
            <div className=" mt-3 sm:flex sm:mt-0 space-x-8 items-center">
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
