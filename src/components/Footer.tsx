export default function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 sm:gap-48">
        <p className="text-center sm:text-left cursor-pointer hover:underline">
          Privacy Policy
        </p>
        <p className="text-center sm:text-left cursor-pointer hover:underline">
          Terms of Service
        </p>
        <p className="text-center sm:text-left cursor-pointer hover:underline">
          Support
        </p>
      </div>
      <div className="mt-6">
        <p className="text-center text-gray-500 text-sm">
          © 2025 FraudGuard. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
