import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col font-poppins bg-gradient-to-br from-san-marino-50 via-san-marino-100 to-san-marino-200">
      <Navbar />
      <div className="flex-grow w-full flex flex-col items-center justify-center px-4 sm:px-8 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold text-san-marino-900 leading-tight max-w-4xl">
          AML Fraud Detection and Transaction Monitoring System
        </h1>

        <p className="text-base sm:text-xl text-san-marino-700 max-w-3xl mt-6">
          FraudGuard is a powerful tool that helps businesses detect and prevent
          fraud. It uses advanced machine learning algorithms to analyze large
          amounts of data and identify patterns that may indicate fraudulent
          activity. FraudGuard also provides real-time monitoring of
          transactions, allowing businesses to take immediate action when
          suspicious activity is detected.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Link
            to={"/login"}
            className="bg-san-marino-600 text-san-marino-50 hover:bg-san-marino-700 px-6 py-3 rounded-full text-lg font-semibold transition-colors shadow-md"
          >
            Get Started
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
