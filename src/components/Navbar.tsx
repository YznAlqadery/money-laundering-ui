import LogoutButton from "./LogoutButton";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="text-xl font-bold text-gray-800">
              FraudGuard
            </a>
          </div>

          {/* Desktop Menu */}
          <div className=" mt-3 sm:flex sm:mt-0 space-x-8 items-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
